package com.example.oss.api.services.Vote;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.example.oss.api.dto.VoteDto;
import com.example.oss.api.dto.VoteValueDto;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import com.example.oss.api.services.modelMapperable;

@Component
public interface VoteService extends modelMapperable<Vote, VoteDto> {
    Vote findById(UUID id);

    Vote findBySurveyAndUser(Survey survey, User user);

    List<Vote> findBySurvey(Survey survey);

    boolean checkVote(Survey survey, User user);

    Vote handleVote(UUID surveyId, UUID surveyOptionId, List<VoteValueDto> voteValues, User user);

    void handleUnvote(UUID surveyId, User user);
}
