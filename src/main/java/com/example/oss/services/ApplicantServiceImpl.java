package com.example.oss.services;

import com.example.oss.model.Applicant;
import com.example.oss.repository.factory.FactoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final FactoryRepository fr;

    @Autowired
    public ApplicantServiceImpl(FactoryRepository factoryRepository) {
        this.fr = factoryRepository;
    }

    @Override
    public Applicant getByName(String name) {
        return fr.getApplicantRepository().getByName(name);
    }

    @Override
    public List<Applicant> getByVotingId(int votingId) {
        return new ArrayList<>(fr.getApplicantRepository().findByVotingId(votingId));
    }

    @Override
    public void insert(Applicant applicant) {
        fr.getApplicantRepository().save(applicant);
    }

    @Override
    public void update(Applicant applicant) {
        fr.getApplicantRepository().save(applicant);
    }
}
