package com.example.oss.api.responses;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BaseResponse {
    private int status;
    private String message;

    public BaseResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
