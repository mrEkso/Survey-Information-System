package com.example.oss.api.services.Survey;

import java.time.Instant;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.oss.api.models.Survey;
import com.example.oss.api.repository.SurveyRepository;
import com.example.oss.api.repository.VoteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SurveyExpirationService {
    private final SurveyRepository surveyRepository;
    private final VoteRepository voteRepository;

    @Scheduled(fixedRate = 60000) // Check every minute
    @Transactional
    public void checkExpiredSurveys() {
        try {
            List<Survey> expiredSurveys = surveyRepository.findByOpenTrueAndExpirationDateLessThanEqual(Instant.now());
            for (Survey survey : expiredSurveys) {
                log.info("Closing expired survey: {}", survey.getId());
                survey.setOpen(false);
                voteRepository.anonymizeVotesBySurveyId(survey.getId());
                surveyRepository.save(survey);
            }
            if (!expiredSurveys.isEmpty()) {
                log.info("Closed {} expired surveys", expiredSurveys.size());
            }
        } catch (Exception e) {
            log.error("Error while checking expired surveys", e);
        }
    }
}