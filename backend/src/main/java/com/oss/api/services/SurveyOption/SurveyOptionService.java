package com.oss.api.services.SurveyOption;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.oss.api.dto.SurveyOptionDto;
import com.oss.api.models.SurveyOption;
import com.oss.api.services.modelMapperable;

@Component
public interface SurveyOptionService extends modelMapperable<SurveyOption, SurveyOptionDto> {

    SurveyOption getByName(String name);

    List<SurveyOption> getBySurveyId(UUID surveyId);

    void insert(SurveyOption surveyOption);

    void update(SurveyOption surveyOption);
}
