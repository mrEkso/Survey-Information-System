package com.oss.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oss.api.models.Survey;
import com.oss.api.models.SurveyOption;
import com.oss.api.models.Vote;
import com.oss.api.models.VoteValue;

@Repository
public interface VoteValueRepository extends JpaRepository<VoteValue, UUID> {
    List<VoteValue> findByVote(Vote vote);

    List<VoteValue> findBySurveyOption(SurveyOption option);

    List<VoteValue> findByVote_Survey(Survey survey);
}