import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export let options = { vus: 1000, duration: '30s' };
export let resultTrend = new Trend('result_duration_ms');

const BASE_URL = 'http://localhost:8080/online-survey-system/api';

export default function () {
    // Для тесту потрібен surveyId (можна підставити вручну для smoke-тесту)
    let surveyId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa00';
    let resultRes;
    for (let i = 0; i < 3; i++) {
        resultRes = http.get(`${BASE_URL}/surveys/result/${surveyId}`);
        if (resultRes.status === 200) break;
        sleep(0.1);
    }
    check(resultRes, {
        'get survey result 200': (r) => r.status === 200,
    });
    //sleep(1);
}