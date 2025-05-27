import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export let options = { vus: 500, duration: '60s' };
export let surveysTrend = new Trend('surveys_duration_ms');

const BASE_URL = 'http://localhost:8080/online-survey-system/api';

export default function () {
    let resultRes;
    for (let i = 0; i < 3; i++) {
        resultRes = http.get(`${BASE_URL}/surveys`);
        if (resultRes.status === 200) break;
        sleep(0.3);
    }
    check(resultRes, { 'get surveys status 200': (r) => r.status === 200 });
    sleep(1);
} 