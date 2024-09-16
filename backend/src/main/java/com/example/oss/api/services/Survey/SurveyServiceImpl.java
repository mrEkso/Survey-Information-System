package com.example.oss.api.services.Survey;

import com.example.oss.api.dto.SurveyDto;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.User;
import com.example.oss.api.repository.factory.FactoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {
    private final int PAGE_SIZE = 9;

    private final FactoryRepository fr;
    private final ModelMapper modelMapper;

    @Override
    public Optional<Survey> findById(UUID id) {
        return fr.getSurveyRepository().findById(id);
    }

    @Override
    public List<Survey> findByUser(User user) {
        return fr.getSurveyRepository().findByUserId(user.getId());
    }

    @Override
    public Page<Survey> findAll(String searchText, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        if (searchText == null || searchText.equals(""))
            return fr.getSurveyRepository().findAll(pageable);
        return fr.getSurveyRepository().findByTitle(pageable, searchText);
    }

    @Override
    public Survey insert(Survey survey, User user) {
        survey.setUser(user);
        return fr.getSurveyRepository().save(survey);
    }

    @Override
    public Survey update(Survey survey, User user) {
        survey.setUser(user);
        return fr.getSurveyRepository().save(survey);
    }

    @Override
    public void delete(Survey survey) {
        fr.getSurveyRepository().delete(survey);
    }

    @Override
    public SurveyDto convertToDto(Survey survey) {
        return modelMapper.map(survey, SurveyDto.class);
    }

    @Override
    public Survey convertToEntity(SurveyDto surveyDto) {
        return modelMapper.map(surveyDto, Survey.class);
    }
}
