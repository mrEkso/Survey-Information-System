import { check } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

// --- Script config ---
export let options = {
    scenarios: {
        // Scenario for warmup - small number of users to warm up the system
        warmup: {
            executor: 'constant-vus',
            vus: 5,
            duration: '5s',
            gracefulStop: '0s',
            tags: { purpose: 'warmup' }, // Label for identification
        },
        // Main scenario with gradual load increase
        load_test: {
            executor: 'ramping-vus',
            startVUs: 10,
            stages: [
                { duration: '10s', target: 100 },   // Gradual increase to 100 VUs in 5 seconds
                { duration: '10s', target: 300 },   // Continue increasing to 300 VUs
                { duration: '20s', target: 500 },  // Maximum load 500 VUs
                { duration: '20s', target: 500 },  // Maintain 500 VUs for stable measurement
            ],
        },
    },
};

const BASE_URL = 'http://localhost:8080/online-survey-system/api';

// --- Metrics for each request ---
export let registerTrend = new Trend('register_duration');
export let verify2faSetupTrend = new Trend('verify2fa_setup_duration');
export let loginTrend = new Trend('login_duration');
export let login2faTrend = new Trend('login2fa_duration');
export let surveysTrend = new Trend('surveys_list_duration');
export let surveyDetailTrend = new Trend('survey_detail_duration');
export let voteTrend = new Trend('vote_duration');
export let unvoteTrend = new Trend('unvote_duration');

// --- Setup function to get survey and option ID (runs once) ---
export function setup() {
    // 5. Get surveys list
    let surveysRes = http.get(`${BASE_URL}/surveys`);
    check(surveysRes, {
        'setup: get surveys status 200': (r) => r.status === 200,
    });
    let surveys = surveysRes.json('content') || [];
    let surveyId = null;
    let optionId = null;

    if (surveys.length > 0) {
        surveyId = surveys[0].id;
        let surveyDetailRes = http.get(`${BASE_URL}/surveys/${surveyId}`);
        check(surveyDetailRes, {
            'setup: get survey detail status 200': (r) => r.status === 200,
        });
        let surveyDetail = surveyDetailRes.json('survey');
        if (surveyDetail && surveyDetail.options && surveyDetail.options.length > 0) {
            optionId = surveyDetail.options[0].id;
        }
    }

    if (!surveyId || !optionId) {
        console.error('Setup failed: Could not get surveyId or optionId.');
        throw new Error('Setup failed to retrieve survey or option ID');
    }

    return { surveyId: surveyId, optionId: optionId };
}

// --- TOTP generator (Google Authenticator, 6 digits, 30 sec, like in Java) ---
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
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
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

// --- Main test function for voting and unvoting ---
export default function (data) { // `data` will contain surveyId and optionId from setup
    const { surveyId, optionId } = data; // Destructure IDs from setup

    if (!surveyId || !optionId) {
        console.error('Skipping VU iteration due to missing surveyId or optionId from setup.');
        return; // Skip iteration if setup data is missing
    }

    // 1. Register a new user for each VU
    let email = `voteuser_${__VU}_${randomString(6)}@test.com`; // Ensure unique email per iteration too
    let ***REMOVED_PASSWORD***;
    let nickname = `votetester_${__VU}_${randomString(5)}`;
    let registerPayload = JSON.stringify({
        email: email,
        password: password,
        nickname: nickname
    });
    let registerRes = http.post(`${BASE_URL}/auth/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(registerRes, {
        'VU: register status 200': (r) => r.status === 200,
    });
    let tempToken = '';
    let secret = '';
    let registrationSuccessful = false;

    try {
        if (registerRes.status === 200) {
            tempToken = registerRes.json('token');
            secret = registerRes.json('secret');
            registrationSuccessful = true;
        }
    } catch (e) {
        console.log('Failed to parse response:', e);
    }

    // Only proceed with 2FA if registration was successful
    if (registrationSuccessful) {
        // 2. Verify 2FA for registration
        let code = generateTOTP(secret);
        let verify2faPayload = JSON.stringify({
            token: tempToken,
            code: code
        });
        let verify2faRes = http.post(`${BASE_URL}/auth/2fa/verify`, verify2faPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        check(verify2faRes, {
            'VU: 2fa verify status 200': (r) => r.status === 200,
        });
        let token = verify2faRes.json('token');

        // 3. Login (get pendingToken because of 2FA)
        let loginPayload = JSON.stringify({
            email: email,
            password: password,
        });
        let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        check(loginRes, {
            'VU: login status 200': (r) => r.status === 200,
        });
        let loginToken = loginRes.json('token');
        let requires2fa_login = loginRes.json('requires2fa'); // Renamed to avoid conflict if any

        let finalToken = token; // Use token from registration 2FA by default

        if (requires2fa_login) {
            // 4. Verify 2FA for login
            let login2fa_code = generateTOTP(secret); // Use the same secret from registration
            let login2faPayload = JSON.stringify({
                token: loginToken,
                code: login2fa_code
            });
            let login2faRes = http.post(`${BASE_URL}/auth/2fa/verify`, login2faPayload, {
                headers: { 'Content-Type': 'application/json' },
            });
            check(login2faRes, {
                'VU: login 2fa verify status 200': (r) => r.status === 200,
            });
            finalToken = login2faRes.json('token'); // Update token to the one from login 2FA
        }

        // At this point, `finalToken` holds the valid auth token for this VU
        // `surveyId` and `optionId` are from the setup function

        // 6. Vote for a survey
        let votePayload = JSON.stringify({
            surveyId: surveyId, // from setup data
            surveyOptionId: optionId, // from setup data
        });
        let voteRes;

        // Retry mechanism for voting
        for (let i = 0; i < 3; i++) {
            voteRes = http.post(`${BASE_URL}/vote`, votePayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${finalToken}`, // Use finalToken
                },
            });

            if (voteRes.status === 200) {
                break; // Success voted, exit loop
            }
        }

        check(voteRes, {
            'VU: vote status 200': (r) => r.status === 200,
        });

        // 7. Unvote (Delete the vote using surveyId)
        let unvoteRes;
        for (let i = 0; i < 3; i++) {
            unvoteRes = http.del(`${BASE_URL}/vote/${surveyId}`, null, { // Pass surveyId in the path
                headers: {
                    Authorization: `Bearer ${finalToken}`, // Use finalToken
                },
            });
            if (unvoteRes.status === 200) {
                break; // Success voted, exit loop
            }
        }
        check(unvoteRes, {
            'VU: unvote status 200': (r) => r.status === 200,
        });
    } // Close the if(registrationSuccessful) block
}