package com.example.oss.api.responses;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BaseResponseWithData {
    private int status;
    private String message;
    private Object data;

    public BaseResponseWithData(int status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
