package com.example.oss.api.responses.auth;

import com.example.oss.api.responses.BaseResponse;

public class LogoutResponse extends BaseResponse {
    public LogoutResponse() {
        super(200, "Ви успішно вийшли з системи");
    }
}
