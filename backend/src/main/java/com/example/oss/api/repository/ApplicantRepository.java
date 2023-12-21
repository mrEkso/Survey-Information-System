package com.example.oss.api.repository;

import com.example.oss.api.models.SurveyOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicantRepository extends JpaRepository<SurveyOption, UUID> {

    SurveyOption getByName(String name);

    List<SurveyOption> getBySurveyId(UUID VotingId);
}
