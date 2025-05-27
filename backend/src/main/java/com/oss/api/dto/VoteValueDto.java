package com.oss.api.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteValueDto {
    private UUID id;
    private UUID surveyOptionId;
    private Integer numericValue;
    private Integer rankPosition;
}