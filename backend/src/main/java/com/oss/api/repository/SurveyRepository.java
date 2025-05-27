package com.oss.api.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oss.api.models.Survey;

import jakarta.transaction.Transactional;

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

        @Modifying
        @Transactional
        @Query("UPDATE Survey s SET s.votesCount = s.votesCount + 1 WHERE s.id = :id")
        void incrementVotes(@Param("id") UUID id);

        @Modifying
        @Transactional
        @Query("UPDATE Survey s SET s.votesCount = GREATEST(0, s.votesCount - 1) WHERE s.id = :id")
        void decrementVotes(@Param("id") UUID id);

        @Modifying
        @Transactional
        @Query("UPDATE Survey s SET s.views = s.views + 1 WHERE s.id = :id")
        void incrementViews(@Param("id") UUID id);
}
