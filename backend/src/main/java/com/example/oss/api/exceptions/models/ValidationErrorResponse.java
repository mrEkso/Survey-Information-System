package com.example.oss.api.exceptions.models;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationErrorResponse extends ErrorResponse {
    private final List<ErrorDetail> errors;

    public ValidationErrorResponse(int status, String reason, String message, List<ErrorDetail> errors) {
        super(status, reason, message);
        this.errors = errors;
    }
}
