package com.oss.api.repository;

import com.oss.api.models.SurveyOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Repository
public interface SurveyOptionRepository extends JpaRepository<SurveyOption, UUID> {

    SurveyOption getByName(String name);

    List<SurveyOption> getBySurveyId(UUID surveyId);

    @Modifying
    @Transactional
    @Query("UPDATE SurveyOption s SET s.votes = s.votes + 1 WHERE s.id = :id")
    void incrementVotes(@Param("id") UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE SurveyOption s SET s.votes = GREATEST(0, s.votes - 1) WHERE s.id = :id")
    void decrementVotes(@Param("id") UUID id);
}
