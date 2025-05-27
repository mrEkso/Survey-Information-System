import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export let options = { vus: 500, duration: '60s' };
export let registerTrend = new Trend('register_duration_ms');

const BASE_URL = 'http://localhost:8080/online-survey-system/api';

function randomString(length) {
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

export default function () {
    let email = `testuser_${randomString(8)}@test.com`;
    let ***REMOVED_PASSWORD***;
    let nickname = `user${randomString(5)}`;
    let registerPayload = JSON.stringify({
        email: email,
        password: password,
        nickname: nickname
    });
    let res;
    for (let i = 0; i < 3; i++) {
        res = http.post(`${BASE_URL}/auth/register`, registerPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 200) break;
        sleep(0.3);
    }
    check(res, { 'register status 200': (r) => r.status === 200 });
    sleep(1);
} 