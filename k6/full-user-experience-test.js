import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export const options = {
    vus: 500, // Typical load: moderate number of virtual users
    duration: '5m', // Typical load: longer duration
};


const BASE_URL = 'http://localhost:8080/online-survey-system/api';

// --- Метрики для кожного запиту ---
export let registerTrend = new Trend('register_duration');
export let verify2faTrend = new Trend('verify2fa_duration');
export let loginTrend = new Trend('login_duration');
export let login2faTrend = new Trend('login2fa_duration');
export let surveysTrend = new Trend('surveys_duration');
export let surveyDetailTrend = new Trend('surveyDetail_duration');
export let voteTrend = new Trend('vote_duration');
export let resultTrend = new Trend('result_duration');

// --- TOTP генератор (Google Authenticator, 6 цифр, 30 сек, як у Java) ---
function base32toBytes(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let bytes = [];
    for (let i = 0; i < base32.length; i++) {
        let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
}

function generateTOTP(secret) {
    if (!secret || typeof secret !== 'string') {
        console.error('TOTP secret is undefined/null:', secret);
        return '000000';
    }
    let key = base32toBytes(secret.replace(/=+$/, ''));
    let epoch = Math.floor(Date.now() / 1000);
    let time = Math.floor(epoch / 30);
    let timeBytes = new Uint8Array(8);
    for (let i = 7; i >= 0; i--) {
        timeBytes[i] = time & 0xff;
        time = time >> 8;
    }
    let hmacBuf = crypto.hmac('sha1', key, timeBytes, 'binary');
    let hmac = new Uint8Array(hmacBuf);
    let offset = hmac[hmac.length - 1] & 0xf;
    let code =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);
    code = code % 1000000;
    return code.toString().padStart(6, '0');
}

// --- Random string ---
function randomString(length) {
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

export default function () {
    // 1. Реєстрація нового користувача
    let email = `testuser_${randomString(8)}@test.com`;
    let ***REMOVED_PASSWORD***;
    let nickname = `user${randomString(5)}`;
    let registerPayload = JSON.stringify({
        email: email,
        password: password,
        nickname: nickname
    });
    let registerRes = http.post(`${BASE_URL}/auth/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    registerTrend.add(registerRes.timings.duration);
    check(registerRes, {
        'register status 200': (r) => r.status === 200,
    });
    let tempToken = registerRes.json('token');
    let secret = registerRes.json('secret');
    sleep(2); // Simulate think time after registration

    // 2. Підтвердження 2FA для реєстрації
    let code = generateTOTP(secret);
    let verify2faPayload = JSON.stringify({
        token: tempToken,
        code: code
    });
    let verify2faRes = http.post(`${BASE_URL}/auth/2fa/verify`, verify2faPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    verify2faTrend.add(verify2faRes.timings.duration);
    check(verify2faRes, {
        '2fa verify status 200': (r) => r.status === 200,
    });
    let token = verify2faRes.json('token');
    sleep(2); // Simulate think time after 2FA verification

    // 3. Логін (отримуємо pendingToken, бо 2FA)
    let loginPayload = JSON.stringify({
        email: email,
        password: password,
    });
    let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    loginTrend.add(loginRes.timings.duration);
    check(loginRes, {
        'login status 200': (r) => r.status === 200,
    });
    let loginToken = loginRes.json('token');
    let requires2fa = loginRes.json('requires2fa');
    sleep(2); // Simulate think time after login attempt

    if (requires2fa) {
        // 4. Підтвердження 2FA для логіну
        let login2faPayload = JSON.stringify({
            token: loginToken,
            code: generateTOTP(secret)
        });
        let login2faRes = http.post(`${BASE_URL}/auth/2fa/verify`, login2faPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        login2faTrend.add(login2faRes.timings.duration);
        check(login2faRes, {
            'login 2fa verify status 200': (r) => r.status === 200,
        });
        token = login2faRes.json('token');
        sleep(2); // Simulate think time after login 2FA verification
    }

    // 5. Отримати список опитувань (авторизовано)
    let surveysRes = http.get(`${BASE_URL}/surveys`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    surveysTrend.add(surveysRes.timings.duration);
    check(surveysRes, {
        'get surveys status 200': (r) => r.status === 200,
    });
    let surveys = surveysRes.json('content') || [];
    let surveyId = null;
    let optionId = null;
    if (surveys.length > 0) {
        surveyId = surveys[0].id;
        sleep(3); // Simulate think time after getting surveys list
        // Вибираємо перший варіант відповіді з опитування
        let surveyDetailRes = http.get(`${BASE_URL}/surveys/${surveyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        surveyDetailTrend.add(surveyDetailRes.timings.duration);
        check(surveyDetailRes, {
            'get survey detail status 200': (r) => r.status === 200,
        });
        let surveyDetail = surveyDetailRes.json('survey');
        if (surveyDetail && surveyDetail.options && surveyDetail.options.length > 0) {
            optionId = surveyDetail.options[0].id;
        }
        sleep(3); // Simulate think time after getting survey detail
    }

    // 6. Голосування за опитування
    if (surveyId && optionId) {
        let votePayload = JSON.stringify({
            surveyId: surveyId,
            surveyOptionId: optionId,
        });
        let voteRes = http.post(`${BASE_URL}/vote`, votePayload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        voteTrend.add(voteRes.timings.duration);
        check(voteRes, {
            'vote status 200': (r) => r.status === 200,
        });
        sleep(3); // Simulate think time after voting
    }

    // 7. Отримати результати опитування
    if (surveyId) {
        let resultRes = http.get(`${BASE_URL}/surveys/result/${surveyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        resultTrend.add(resultRes.timings.duration);
        check(resultRes, {
            'get survey result 200': (r) => r.status === 200,
        });
        sleep(2); // Simulate think time after getting results
    }

    sleep(5); // Simulate idle time before the next iteration
}
