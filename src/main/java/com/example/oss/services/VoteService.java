package com.example.oss.services;

import com.example.oss.model.User;
import com.example.oss.model.Vote;
import com.example.oss.model.Voting;

import java.util.Optional;

public interface VoteService {
    Optional<Vote> findById(int id);

    Vote findByVotingAndUser(Voting voting, User user);

    boolean checkVote(Vote vote);

    void vote(Vote vote);

    void unvote(Vote vote);
}
