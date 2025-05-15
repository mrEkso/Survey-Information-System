package com.example.oss.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачи данных о голосах
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteDto {
    private UUID id;
    private UUID surveyOptionId; // For SINGLE_CHOICE
    private Instant createdAt;
    private List<VoteValueDto> voteValues;
}