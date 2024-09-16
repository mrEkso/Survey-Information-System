package com.example.oss.api.repository;

import com.example.oss.api.models.Survey;
import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Vote findBySurveyAndUser(Survey survey, User user);
}