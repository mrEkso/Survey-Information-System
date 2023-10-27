package com.example.oss.services;

import com.example.oss.model.Applicant;

import java.util.List;

public interface ApplicantService {

    Applicant getByName(String name);

    List<Applicant> getByVotingId(int votingId);

    void insert(Applicant applicant);

    void update(Applicant applicant);
}
