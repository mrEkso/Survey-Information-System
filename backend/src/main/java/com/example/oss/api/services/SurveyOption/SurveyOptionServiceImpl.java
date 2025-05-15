package com.example.oss.api.services.SurveyOption;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.oss.api.dto.SurveyOptionDto;
import com.example.oss.api.models.SurveyOption;
import com.example.oss.api.repository.factory.FactoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SurveyOptionServiceImpl implements SurveyOptionService {
    private final FactoryRepository fr;
    private final ModelMapper modelMapper;

    @Override
    public SurveyOption getByName(String name) {
        return fr.getSurveyOptionRepository().getByName(name);
    }

    @Override
    public List<SurveyOption> getBySurveyId(UUID surveyId) {
        return fr.getSurveyOptionRepository().getBySurveyId(surveyId);
    }

    @Override
    public void insert(SurveyOption surveyOption) {
        fr.getSurveyOptionRepository().save(surveyOption);
    }

    @Override
    public void update(SurveyOption surveyOption) {
        fr.getSurveyOptionRepository().save(surveyOption);
    }

    @Override
    public SurveyOptionDto convertToDto(SurveyOption surveyOption) {
        return modelMapper.map(surveyOption, SurveyOptionDto.class);
    }

    @Override
    public SurveyOption convertToEntity(SurveyOptionDto surveyOptionDto) {
        return modelMapper.map(surveyOptionDto, SurveyOption.class);
    }
}
