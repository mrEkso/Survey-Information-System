package com.example.oss.api.services.Applicant;

import com.example.oss.api.models.SurveyOption;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public interface ApplicantService {

    SurveyOption getByName(String name);

    List<SurveyOption> getByVotingId(UUID votingId);

    void insert(SurveyOption applicant);

    void update(SurveyOption applicant);
}
