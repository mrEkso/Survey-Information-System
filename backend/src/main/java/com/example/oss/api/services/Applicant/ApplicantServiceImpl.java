package com.example.oss.api.services.Applicant;

import com.example.oss.api.models.SurveyOption;
import com.example.oss.api.repository.factory.FactoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final FactoryRepository fr;

    @Autowired
    public ApplicantServiceImpl(FactoryRepository factoryRepository) {
        this.fr = factoryRepository;
    }

    @Override
    public SurveyOption getByName(String name) {
        return fr.getApplicantRepository().getByName(name);
    }

    @Override
    public List<SurveyOption> getByVotingId(UUID votingId) {
        return new ArrayList<>(fr.getApplicantRepository().getBySurveyId(votingId));
    }

    @Override
    public void insert(SurveyOption applicant) {
        fr.getApplicantRepository().save(applicant);
    }

    @Override
    public void update(SurveyOption applicant) {
        fr.getApplicantRepository().save(applicant);
    }
}
