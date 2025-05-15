package com.example.oss.api.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyListItemDto {
    private UUID id;
    private String title;
    private String subtitle;
    private UserDto user;
    private Instant createdAt;
    private boolean open;
    private Instant expirationDate;
    private int views;
    private String imageUrl;
    private int votesCount;
    private int messagesCount;
}