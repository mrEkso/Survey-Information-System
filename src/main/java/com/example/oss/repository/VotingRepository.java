package com.example.oss.repository;

import com.example.oss.model.Voting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface VotingRepository extends JpaRepository<Voting, Integer> {
    List<Voting> findTop20ByOrderByCreatedAtAsc();

    List<Voting> findByUserId(int userId);

    List<Voting> findByTitle(String title);

    Voting findByCreatedAt(Instant time);
}
