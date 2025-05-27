import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export let options = { vus: 50, duration: '5s' };
export let surveyDetailTrend = new Trend('surveyDetail_duration_ms');

const BASE_URL = 'http://localhost:8080/online-survey-system/api';

function randomString(length) {
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function base32ToBytes(base32) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let bytes = [];
    for (let i = 0; i < base32.length; i++) {
        let val = alphabet.indexOf(base32[i].toUpperCase());
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
}

function leftpad(str, len, pad) {
    return (Array(len).join(pad) + str).slice(-len);
}

function generateTOTP(secret) {
    let key = base32ToBytes(secret.replace(/=+$/, ''));
    let epoch = Math.floor(Date.now() / 1000);
    let time = leftpad(Math.floor(epoch / 30).toString(16), 16, '0');
    let msg = new Uint8Array(8);
    for (let i = 0; i < 8; ++i) msg[i] = parseInt(time.substr(i * 2, 2), 16);
    let hash = http.crypto.hmac('sha1', msg, key, 'binary');
    let offset = hash[hash.length - 1] & 0xf;
    let code = ((hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff));
    return leftpad((code % 1000000).toString(), 6, '0');
}

export default function () {
    let email = `testuser_${randomString(8)}@test.com`;
    let ***REMOVED_PASSWORD***;
    let nickname = `user${randomString(5)}`;
    let registerPayload = JSON.stringify({ email, password, nickname });
    let regRes = http.post(`${BASE_URL}/auth/register`, registerPayload, { headers: { 'Content-Type': 'application/json' } });
    let regBody = regRes.json();
    let tempToken = regBody && regBody.tempToken;
    let secret = regBody && regBody.secret;
    if (!tempToken || !secret) {
        console.error('Missing tempToken or secret', regBody);
        return;
    }
    let code = generateTOTP(secret);
    let verifyPayload = JSON.stringify({ token: tempToken, code: code });
    let verifyRes = http.post(`${BASE_URL}/auth/2fa/verify`, verifyPayload, { headers: { 'Content-Type': 'application/json' } });
    if (verifyRes.status !== 200) {
        console.error('2FA verify failed', verifyRes.body);
        return;
    }
    let loginPayload = JSON.stringify({ email, password });
    let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers: { 'Content-Type': 'application/json' } });
    let loginBody = loginRes.json();
    let token = loginBody && loginBody.token;
    if (!token) {
        console.error('Login failed', loginBody);
        return;
    }
    let surveysRes = http.get(`${BASE_URL}/surveys`, { headers: { Authorization: `Bearer ${token}` } });
    let surveys = surveysRes.json();
    if (!Array.isArray(surveys) || surveys.length === 0) {
        console.error('No surveys found', surveys);
        return;
    }
    let surveyId = surveys[0].id;
    let res = http.get(`${BASE_URL}/surveys/${surveyId}`, { headers: { Authorization: `Bearer ${token}` } });
    surveyDetailTrend.add(res.timings.duration);
    check(res, { 'get survey detail status 200': (r) => r.status === 200 });
    sleep(1);
} 