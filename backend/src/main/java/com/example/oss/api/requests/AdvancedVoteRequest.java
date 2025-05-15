package com.example.oss.api.requests;

import java.util.List;
import java.util.UUID;

import com.example.oss.api.dto.VoteValueDto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvancedVoteRequest {
    @NotNull
    private UUID surveyId;

    @NotEmpty
    private List<VoteValueDto> voteValues;
}