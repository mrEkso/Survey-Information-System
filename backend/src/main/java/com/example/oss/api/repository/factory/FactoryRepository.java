package com.example.oss.api.repository.factory;

import com.example.oss.api.repository.MessageRepository;
import com.example.oss.api.repository.SurveyOptionRepository;
import com.example.oss.api.repository.SurveyRepository;
import com.example.oss.api.repository.UserRepository;
import com.example.oss.api.repository.VoteRepository;
import com.example.oss.api.repository.VoteValueRepository;

public interface FactoryRepository {
    SurveyOptionRepository getSurveyOptionRepository();

    UserRepository getUserRepository();

    VoteRepository getVoteRepository();

    SurveyRepository getSurveyRepository();

    MessageRepository getMessageRepository();

    VoteValueRepository getVoteValueRepository();
}
