package com.example.oss.api.responses;

import com.example.oss.api.lang.LocalizationService;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BaseResponseWithData {
    private int status;
    private String message;
    private Object data;

    public BaseResponseWithData(int status, String msgCode, Object data) {
        this.status = status;
        this.message = LocalizationService.toLocale(msgCode);
        this.data = data;
    }
}
