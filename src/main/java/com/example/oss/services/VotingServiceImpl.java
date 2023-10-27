package com.example.oss.services;

import com.example.oss.model.Applicant;
import com.example.oss.model.Voting;
import com.example.oss.repository.factory.FactoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VotingServiceImpl implements VotingService {
    private final FactoryRepository fr;
    private final ApplicantService applicantService;

    @Autowired
    public VotingServiceImpl(FactoryRepository factoryDao, ApplicantService applicantService) {
        this.fr = factoryDao;
        this.applicantService = applicantService;
    }

    @Override
    public Optional<Voting> getById(int id) {
        return fr.getVotingRepository().findById(id);
    }

    @Override
    public List<Voting> findByUserId(int userId) {
        return fr.getVotingRepository().findByUserId(userId);
    }

    @Override
    public List<Voting> getAll() {
        return fr.getVotingRepository().findTop20ByOrderByCreatedAtAsc();
    }

    @Override
    public List<Voting> getAll(String searchText) {
        return fr.getVotingRepository().findByTitle(searchText);
    }

    @Override
    public void insert(Voting voting, List<Applicant> applicants) {
        fr.getVotingRepository().save(voting);
        applicants.forEach(applicantService::insert);
    }

    @Override
    public void update(Voting voting) {
        fr.getVotingRepository().save(voting);
    }

    @Override
    public void delete(Voting voting) {
        fr.getVotingRepository().delete(voting);
    }
}
