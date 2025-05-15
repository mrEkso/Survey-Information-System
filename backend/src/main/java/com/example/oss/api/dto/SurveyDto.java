package com.example.oss.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.example.oss.api.enums.SurveyType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Instant expirationDate;
    private int views;
    private String imageUrl;
    private List<SurveyOptionDto> options;
    private int votesCount;
    private int messagesCount;
    private SurveyType surveyType;
    private Integer minRating;
    private Integer maxRating;
    private List<String> matrixColumns;
}
