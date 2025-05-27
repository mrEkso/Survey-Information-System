package com.oss.api.services.Survey;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.oss.api.dto.SurveyDto;
import com.oss.api.dto.SurveyListItemDto;
import com.oss.api.models.Survey;
import com.oss.api.models.User;
import com.oss.api.services.modelMapperable;

@Component
public interface SurveyService extends modelMapperable<Survey, SurveyDto> {
    Survey findById(UUID id);

    Survey findByIdWithIncrementViews(UUID id, User user);

    Page<Survey> findByUser(User user, int page, String searchText, Boolean open, String sort);

    List<Survey> findByUser(User user);

    Page<Survey> findAll(String searchText, int page, Boolean open, String sort);

    Survey create(SurveyDto surveyDto, User user);

    Survey update(SurveyDto surveyDto, User user);

    void delete(UUID id) throws IOException;

    Survey uploadSurveyImage(String id, MultipartFile image, User user) throws IOException;

    Resource getSurveyImage(String fileName) throws IOException;

    SurveyListItemDto convertToListItemDto(Survey survey);
}
