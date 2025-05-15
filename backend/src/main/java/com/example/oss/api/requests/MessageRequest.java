package com.example.oss.api.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull
    private UUID surveyId;

    @NotBlank
    @Size(max = 1000)
    private String content;
}