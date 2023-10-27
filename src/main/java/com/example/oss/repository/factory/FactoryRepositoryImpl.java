package com.example.oss.repository.factory;

import com.example.oss.repository.ApplicantRepository;
import com.example.oss.repository.UserRepository;
import com.example.oss.repository.VoteRepository;
import com.example.oss.repository.VotingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryRepositoryImpl implements FactoryRepository {
    ApplicantRepository applicantRepository;
    UserRepository userRepository;
    VoteRepository voteRepository;
    VotingRepository votingRepository;

    @Autowired
    public FactoryRepositoryImpl(ApplicantRepository applicantRepository, UserRepository userRepository, VoteRepository voteRepository, VotingRepository votingRepository) {
        this.applicantRepository = applicantRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
        this.votingRepository = votingRepository;
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
    public VotingRepository getVotingRepository() {
        return votingRepository;
    }
}
