package com.oss.api.repository.factory;

import com.oss.api.repository.MessageRepository;
import com.oss.api.repository.SurveyOptionRepository;
import com.oss.api.repository.SurveyRepository;
import com.oss.api.repository.UserRepository;
import com.oss.api.repository.VoteRepository;
import com.oss.api.repository.VoteValueRepository;

public interface FactoryRepository {
    SurveyOptionRepository getSurveyOptionRepository();

    UserRepository getUserRepository();

    VoteRepository getVoteRepository();

    SurveyRepository getSurveyRepository();

    MessageRepository getMessageRepository();

    VoteValueRepository getVoteValueRepository();
}
