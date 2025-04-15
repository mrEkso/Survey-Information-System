package com.example.oss.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class SurveyDto {
    private UUID id;
    private UserDto user;
    private String title;
    private String subtitle;
    private Instant createdAt;
    private boolean open;
}
