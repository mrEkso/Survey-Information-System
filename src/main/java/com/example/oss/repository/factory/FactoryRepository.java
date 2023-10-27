package com.example.oss.repository.factory;

import com.example.oss.repository.ApplicantRepository;
import com.example.oss.repository.UserRepository;
import com.example.oss.repository.VoteRepository;
import com.example.oss.repository.VotingRepository;

public interface FactoryRepository {
    ApplicantRepository getApplicantRepository();

    UserRepository getUserRepository();

    VoteRepository getVoteRepository();

    VotingRepository getVotingRepository();
}
