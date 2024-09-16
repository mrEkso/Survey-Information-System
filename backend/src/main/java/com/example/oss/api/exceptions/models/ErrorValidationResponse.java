package com.example.oss.api.exceptions.models;

import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class ErrorValidationResponse extends ErrorResponse {
    private final List<ErrorDetail> errors;

    public ErrorValidationResponse(int status, String reason, String message, List<ErrorDetail> errors) {
        super(status, reason, message);
        this.errors = errors;
    }
}
