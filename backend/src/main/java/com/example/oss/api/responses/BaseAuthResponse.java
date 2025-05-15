package com.example.oss.api.responses;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BaseAuthResponse {
    private int status;
    private String message;
    private Object data;
    private String token;

    public BaseAuthResponse(int status, String message, Object data, String token) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.token = token;
    }
}
