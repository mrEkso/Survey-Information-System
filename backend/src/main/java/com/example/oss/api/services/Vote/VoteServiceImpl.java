package com.example.oss.api.services.Vote;

import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import com.example.oss.api.models.Survey;
import com.example.oss.api.repository.factory.FactoryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class VoteServiceImpl implements VoteService {
    private final FactoryRepository fr;

    public VoteServiceImpl(FactoryRepository factoryRepository) {
        this.fr = factoryRepository;
    }

    @Override
    public Optional<Vote> findById(UUID id) {
        return fr.getVoteRepository().findById(id);
    }

    @Override
    public Vote findByVotingAndUser(Survey voting, User user) {
        return fr.getVoteRepository().findBySurveyAndUser(voting, user);
    }

    @Override
    public boolean checkVote(Vote vote) {
        return findById(vote.getId()).isPresent();
    }

    @Override
    public void vote(Vote vote) {
        fr.getVoteRepository().save(vote);
    }

    @Override
    public void unvote(Vote vote) {
        fr.getVoteRepository().delete(vote);
    }
}
