package com.example.oss.api.services.Survey;

import com.example.oss.api.dto.SurveyDto;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.User;
import com.example.oss.api.services.modelMapperable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public interface SurveyService extends modelMapperable<Survey, SurveyDto> {
    Optional<Survey> findById(UUID id);

    List<Survey> findByUser(User user);

    Page<Survey> findAll(String searchText, int page);

    Survey insert(Survey survey, User user);

    Survey update(Survey survey, User user);

    void delete(Survey survey);
}
