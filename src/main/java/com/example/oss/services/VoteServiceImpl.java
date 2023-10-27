package com.example.oss.services;

import com.example.oss.model.User;
import com.example.oss.model.Vote;
import com.example.oss.model.Voting;
import com.example.oss.repository.factory.FactoryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VoteServiceImpl implements VoteService {
    private final FactoryRepository fr;

    public VoteServiceImpl(FactoryRepository factoryRepository) {
        this.fr = factoryRepository;
    }

    @Override
    public Optional<Vote> findById(int id) {
        return fr.getVoteRepository().findById(id);
    }

    @Override
    public Vote findByVotingAndUser(Voting voting, User user) {
        return fr.getVoteRepository().findByVotingAndUser(voting, user);
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
