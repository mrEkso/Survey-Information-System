package com.example.oss.api.responses;

import com.example.oss.api.lang.LocalizationService;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BaseResponse {
    private int status;
    private String message;

    public BaseResponse(int status, String msgCode) {
        this.status = status;
        this.message = LocalizationService.toLocale(msgCode);
    }
}
