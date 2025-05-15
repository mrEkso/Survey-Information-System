package com.example.oss.api.requests;

import java.util.List;
import java.util.UUID;

import com.example.oss.api.dto.VoteValueDto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Универсальный запрос для всех типов голосования
 * - Для SINGLE_CHOICE используется surveyOptionId
 * - Для MULTIPLE_CHOICE, RATING_SCALE, MATRIX и RANKING используется voteValues
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversalVoteRequest {
    @NotNull
    private UUID surveyId;
    // For SINGLE_CHOICE
    private UUID surveyOptionId;
    // For all other types of voting
    private List<VoteValueDto> voteValues;
}