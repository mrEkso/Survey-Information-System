package com.example.oss.api.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Data;

@Data
public class MessageDto {
    private UUID id;
    private UserDto user;
    private String content;
    private Instant createdAt;
}