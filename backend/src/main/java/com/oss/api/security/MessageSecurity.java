package com.oss.api.security;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.oss.api.models.Survey;
import com.oss.api.models.User;
import com.oss.api.repository.SurveyRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class MessageSecurity {
    private final SurveyRepository surveyRepository;

    public boolean isSurveyOwner(UUID surveyId, User user) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        return survey != null && survey.getUser().getId().equals(user.getId());
    }
}