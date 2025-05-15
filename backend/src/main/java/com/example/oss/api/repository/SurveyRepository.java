package com.example.oss.api.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.oss.api.models.Survey;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, UUID> {

        Page<Survey> findByUserId(UUID userId, Pageable pageable);

        List<Survey> findByUserId(UUID userId);

        Page<Survey> findByTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCase(Pageable pageable, String title,
                        String subtitle);

        Page<Survey> findByTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCaseAndOpen(Pageable pageable,
                        String title, String subtitle, boolean open);

        Page<Survey> findByOpen(Pageable pageable, boolean open);

        List<Survey> findByOpenTrueAndExpirationDateLessThanEqual(Instant now);

        Page<Survey> findByUserIdAndOpen(Pageable pageable, UUID userId, boolean open);

        Page<Survey> findByUserIdAndTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCase(
                        Pageable pageable, UUID userId, String title, String subtitle);

        Page<Survey> findByUserIdAndTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCaseAndOpen(
                        Pageable pageable, UUID userId, String title, String subtitle, boolean open);
}
