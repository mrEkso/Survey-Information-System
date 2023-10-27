package com.example.oss.repository;

import com.example.oss.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Integer> {

    Applicant getByName(String name);

    List<Applicant> findByVotingId(int votingId);
}
