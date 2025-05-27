package com.oss.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.oss.api.enums.SurveyType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SurveyDto {
    private UUID id;
    private UserDto user;
    @NotBlank
    @Size(max = 100)
    private String title;
    @NotBlank
    @Size(max = 500)
    private String subtitle;
    private Instant createdAt;
    private boolean open;
    private Instant expirationDate;
    private int views;
    private String imageUrl;
    private List<SurveyOptionDto> options;
    private int votesCount;
    private int messagesCount;
    @NotNull
    private SurveyType surveyType;
    @Min(1)
    private Integer minRating;
    @Max(10)
    private Integer maxRating;
    private List<String> matrixColumns;
}
