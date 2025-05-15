package com.example.oss.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.oss.api.models.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySurveyId(UUID surveyId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Message m WHERE m.survey.id = :surveyId")
    void deleteBySurveyId(UUID surveyId);
}