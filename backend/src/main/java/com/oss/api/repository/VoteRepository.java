package com.oss.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.oss.api.models.Survey;
import com.oss.api.models.User;
import com.oss.api.models.Vote;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Optional<Vote> findBySurveyAndUser(Survey survey, User user);

    List<Vote> findBySurveyIdOrderByCreatedAtAsc(UUID surveyId);

    @Modifying
    @Transactional
    @Query("UPDATE Vote v SET v.user = null WHERE v.survey.id = :surveyId")
    void anonymizeVotesBySurveyId(UUID surveyId);

    @Modifying
    @Transactional
    void deleteBySurveyId(UUID surveyId);
}