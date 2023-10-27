package com.example.oss.services;

import com.example.oss.model.Applicant;
import com.example.oss.model.Voting;

import java.util.List;
import java.util.Optional;

public interface VotingService {
    Optional<Voting> getById(int id);

    List<Voting> findByUserId(int userId);

    List<Voting> getAll();

    List<Voting> getAll(String searchText);

    void insert(Voting voting, List<Applicant> applicants);

    void delete(Voting voting);

    void update(Voting voting);
}
