package com.example.oss.repository;

import com.example.oss.model.User;
import com.example.oss.model.Vote;
import com.example.oss.model.Voting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Integer> {
    Vote findByVotingAndUser(Voting voting, User user);
}
