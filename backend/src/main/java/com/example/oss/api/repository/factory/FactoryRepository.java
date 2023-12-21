package com.example.oss.api.repository.factory;

import com.example.oss.api.repository.ApplicantRepository;
import com.example.oss.api.repository.SurveyRepository;
import com.example.oss.api.repository.UserRepository;
import com.example.oss.api.repository.VoteRepository;

public interface FactoryRepository {
    ApplicantRepository getApplicantRepository();

    UserRepository getUserRepository();

    VoteRepository getVoteRepository();

    SurveyRepository getSurveyRepository();
}
