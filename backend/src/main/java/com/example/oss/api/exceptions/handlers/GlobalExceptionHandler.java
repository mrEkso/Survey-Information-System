package com.example.oss.api.exceptions.handlers;

import com.example.oss.api.exceptions.models.ErrorDetail;
import com.example.oss.api.exceptions.models.ErrorResponse;
import com.example.oss.api.exceptions.models.ErrorValidationResponse;
import jakarta.security.auth.message.AuthException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

import static com.example.oss.api.lang.LocalizationService.toLocale;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String message = toLocale("error.data.integrity");

        if (ex.getMessage().contains("UK_r43af9ap4edm43mmtq01oddj6"))
            message = toLocale("error.user.username.unique");

        if (ex.getMessage().contains("UK_6dotkott2kjsp8vw4d0m25fb7"))
            message = toLocale("error.user.email.unique");

        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                message);
    }

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleNullPointerException(NullPointerException ex) {
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                ex.getMessage() != null ? ex.getMessage() : "Null value encountered");
    }

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorResponse handleBadCredentialsException(AuthException ex) {
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getClass().getSimpleName(),
                ex.getMessage() != null ? ex.getMessage() : "Authentication failed");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorValidationResponse handleValidationException(MethodArgumentNotValidException ex) {
        List<ErrorDetail> errors = ex.getFieldErrors().stream()
                .map(fieldError -> new ErrorDetail(
                    fieldError.getField(), 
                    fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Validation failed"
                ))
                .toList();

        return new ErrorValidationResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                toLocale("error.validation.failed",
                        ex.getObjectName(), ex.getErrorCount()),
                errors);
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorResponse handleGeneralException(Exception ex) {
        return new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getClass().getSimpleName(),
                "Server error: " + ex.getMessage());
    }
}
