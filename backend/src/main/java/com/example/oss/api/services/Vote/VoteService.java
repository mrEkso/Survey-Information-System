package com.example.oss.api.services.Vote;

import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import com.example.oss.api.models.Survey;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public interface VoteService {
    Optional<Vote> findById(UUID id);

    Vote findByVotingAndUser(Survey voting, User user);

    boolean checkVote(Vote vote);

    void vote(Vote vote);

    void unvote(Vote vote);
}
