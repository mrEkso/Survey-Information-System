package com.example.oss.api.repository.factory;

import com.example.oss.api.repository.ApplicantRepository;
import com.example.oss.api.repository.SurveyRepository;
import com.example.oss.api.repository.UserRepository;
import com.example.oss.api.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryRepositoryImpl implements FactoryRepository {
    ApplicantRepository applicantRepository;
    UserRepository userRepository;
    VoteRepository voteRepository;
    SurveyRepository surveyRepository;

    @Autowired
    public FactoryRepositoryImpl(ApplicantRepository applicantRepository, UserRepository userRepository, VoteRepository voteRepository, SurveyRepository surveyRepository) {
        this.applicantRepository = applicantRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
        this.surveyRepository = surveyRepository;
    }

    @Override
    public ApplicantRepository getApplicantRepository() {
        return applicantRepository;
    }

    @Override
    public UserRepository getUserRepository() {
        return userRepository;
    }

    @Override
    public VoteRepository getVoteRepository() {
        return voteRepository;
    }

    @Override
    public SurveyRepository getSurveyRepository() {
        return surveyRepository;
    }
}
