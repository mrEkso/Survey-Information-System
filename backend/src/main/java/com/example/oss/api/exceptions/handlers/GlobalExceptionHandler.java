package com.example.oss.api.exceptions.handlers;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.example.oss.api.exceptions.models.ErrorDetail;
import com.example.oss.api.exceptions.models.ErrorResponse;
import com.example.oss.api.exceptions.models.ErrorValidationResponse;

import jakarta.security.auth.message.AuthException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        log.error("DataIntegrityViolationException", ex);
        String message = "Помилка цілісності даних";
        if (ex.getMessage().contains("UK_r43af9ap4edm43mmtq01oddj6"))
            message = "Користувач з таким нікнеймом вже існує";
        if (ex.getMessage().contains("UK_6dotkott2kjsp8vw4d0m25fb7"))
            message = "Користувач з такою електронною поштою вже існує";
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                message);
    }

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleNullPointerException(NullPointerException ex) {
        log.error("NullPointerException", ex);
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                ex.getMessage() != null ? ex.getMessage() : "Помилка значення");
    }

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorResponse handleBadCredentialsException(AuthException ex) {
        log.error("AuthException", ex);
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getClass().getSimpleName(),
                ex.getMessage() != null ? ex.getMessage() : "Помилка автентифікації");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorValidationResponse handleValidationException(MethodArgumentNotValidException ex) {
        List<ErrorDetail> errors = ex.getFieldErrors().stream()
                .map(fieldError -> new ErrorDetail(
                        fieldError.getField(),
                        fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage()
                                : "Помилка валідації для " + fieldError.getField()))
                .toList();

        return new ErrorValidationResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getClass().getSimpleName(),
                "Помилка валідації для " + ex.getObjectName(),
                errors);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorResponse handleGeneralException(Exception ex) {
        log.error("Exception", ex);
        return new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getClass().getSimpleName(),
                "Помилка сервера: " + ex.getMessage());
    }
}
