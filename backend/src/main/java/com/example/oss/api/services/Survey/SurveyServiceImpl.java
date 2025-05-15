package com.example.oss.api.services.Survey;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.oss.api.dto.SurveyDto;
import com.example.oss.api.dto.SurveyListItemDto;
import com.example.oss.api.enums.SurveyType;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.SurveyOption;
import com.example.oss.api.models.User;
import com.example.oss.api.repository.factory.FactoryRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {
    private final int PAGE_SIZE = 9;

    private final FactoryRepository fr;
    private final ModelMapper modelMapper;

    @Override
    public Survey findById(UUID id) {
        return fr.getSurveyRepository().findById(id)
                .orElseThrow(() -> new NullPointerException("Опитування не знайдено"));
    }

    @Override
    public Survey findByIdWithIncrementViews(UUID id, User user) {
        Survey survey = findById(id);
        if (user != null && !survey.getUser().getId().equals(user.getId())) {
            survey.setViews(survey.getViews() + 1);
            return fr.getSurveyRepository().save(survey);
        }
        return survey;
    }

    @Override
    public Page<Survey> findByUser(User user, int page, String searchText, Boolean open, String sort) {
        var pageable = PageRequest.of(page, PAGE_SIZE, getSort(sort));
        if (open == null && (searchText == null || searchText.isEmpty()))
            return fr.getSurveyRepository().findByUserId(user.getId(), pageable);
        if (open == null)
            return fr.getSurveyRepository()
                    .findByUserIdAndTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCase(
                            pageable, user.getId(), searchText, searchText);
        return (searchText == null || searchText.isEmpty())
                ? fr.getSurveyRepository().findByUserIdAndOpen(pageable, user.getId(), open)
                : fr.getSurveyRepository()
                        .findByUserIdAndTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCaseAndOpen(
                                pageable, user.getId(), searchText, searchText, open);
    }

    @Override
    public Page<Survey> findAll(String searchText, int page, Boolean open, String sort) {
        var pageable = PageRequest.of(page, PAGE_SIZE, getSort(sort));
        if (open == null && (searchText == null || searchText.isEmpty()))
            return fr.getSurveyRepository().findAll(pageable);
        if (open == null)
            return fr.getSurveyRepository().findByTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCase(pageable,
                    searchText, searchText);
        return (searchText == null || searchText.isEmpty())
                ? fr.getSurveyRepository().findByOpen(pageable, open)
                : fr.getSurveyRepository().findByTitleContainingIgnoreCaseOrSubtitleContainingIgnoreCaseAndOpen(
                        pageable, searchText, searchText, open);
    }

    @Override
    @Transactional
    public Survey create(SurveyDto surveyDto, User user) {
        Survey survey = convertToEntity(surveyDto);
        if (survey.getOptions() == null || survey.getOptions().size() < 2)
            throw new IllegalArgumentException("Опитування повинно містити щонайменше 2 варіанти відповіді");
        if (survey.getExpirationDate() != null && survey.getExpirationDate().isBefore(Instant.now()))
            throw new IllegalArgumentException("Дата закриття опитування не може бути в минулому");
        if (surveyDto.getSurveyType() == SurveyType.RATING_SCALE) {
            if (surveyDto.getMinRating() == null || surveyDto.getMaxRating() == null)
                throw new IllegalArgumentException(
                        "Для рейтингової шкали необхідно вказати мінімальне та максимальне значення");
            if (surveyDto.getMinRating() >= surveyDto.getMaxRating())
                throw new IllegalArgumentException("Мінімальне значення має бути менше за максимальне");
        }
        if (surveyDto.getSurveyType() == SurveyType.MATRIX &&
                (surveyDto.getMatrixColumns() == null || surveyDto.getMatrixColumns().isEmpty()))
            throw new IllegalArgumentException("Для матричного опитування необхідно вказати колонки");
        survey.setUser(user);
        if (survey.getOptions() != null)
            survey.getOptions().forEach(o -> o.setSurvey(survey));
        return fr.getSurveyRepository().save(survey);
    }

    @Override
    @Transactional
    public Survey update(SurveyDto surveyDto, User user) {
        Survey survey = convertToEntity(surveyDto);
        if (survey.getOptions() == null || survey.getOptions().size() < 2)
            throw new IllegalArgumentException("Опитування повинно містити щонайменше 2 варіанти відповіді");
        if (survey.getExpirationDate() != null && survey.getExpirationDate().isBefore(Instant.now()))
            throw new IllegalArgumentException("Дата закриття опитування не може бути в минулому");
        if (surveyDto.getSurveyType() == SurveyType.RATING_SCALE) {
            if (surveyDto.getMinRating() == null || surveyDto.getMaxRating() == null)
                throw new IllegalArgumentException(
                        "Для рейтингової шкали необхідно вказати мінімальне та максимальне значення");
            if (surveyDto.getMinRating() >= surveyDto.getMaxRating())
                throw new IllegalArgumentException("Мінімальне значення має бути менше за максимальне");
        }
        if (surveyDto.getSurveyType() == SurveyType.MATRIX &&
                (surveyDto.getMatrixColumns() == null || surveyDto.getMatrixColumns().isEmpty()))
            throw new IllegalArgumentException("Для матричного опитування необхідно вказати колонки");
        survey.setUser(user);
        if (!(findById(survey.getId()).isOpen() && !survey.isOpen()))
            return resetSurvey(survey);
        // When survey is closed (opened -> closed) - anonymize votes
        return anonymizeVotes(survey);
    }

    @Override
    @Transactional
    public void delete(UUID id) throws IOException {
        Survey survey = findById(id);
        if (survey.getImageUrl() != null)
            Files.deleteIfExists(Paths.get("uploads/surveys", survey.getImageUrl().replaceAll(".*/", "")));
        fr.getSurveyRepository().delete(survey);
    }

    @Override
    @Transactional
    public Survey uploadSurveyImage(String id, MultipartFile image, User user) throws IOException {
        if (image.getSize() > 1024 * 1024)
            throw new IllegalArgumentException("Зображення не може бути більшим за 1MB");
        Survey survey = findById(UUID.fromString(id));
        var uploadPath = Paths.get("uploads/surveys");
        if (!Files.exists(uploadPath))
            Files.createDirectories(uploadPath);
        var fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Files.copy(image.getInputStream(), uploadPath.resolve(fileName));
        survey.setImageUrl("/api/surveys/images/" + fileName);
        return fr.getSurveyRepository().save(survey);
    }

    @Override
    public Resource getSurveyImage(String fileName) throws IOException {
        var uploadPath = Paths.get("uploads/surveys");
        if (!Files.exists(uploadPath))
            throw new NullPointerException("Зображення не знайдено");
        return new UrlResource(uploadPath.resolve(fileName).toUri());
    }

    @Override
    public SurveyDto convertToDto(Survey survey) {
        SurveyDto dto = modelMapper.map(survey, SurveyDto.class);
        // Handle matrix columns conversion from string to list
        if (survey.getMatrixColumns() != null && !survey.getMatrixColumns().isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> matrixColumns = objectMapper.readValue(survey.getMatrixColumns(),
                        new TypeReference<List<String>>() {
                        });
                dto.setMatrixColumns(matrixColumns);
            } catch (Exception e) {
                // Fallback to empty list if parsing fails
                dto.setMatrixColumns(new ArrayList<>());
            }
        }
        dto.setMessagesCount(survey.getMessages() != null ? survey.getMessages().size() : 0);
        return dto;
    }

    @Override
    public Survey convertToEntity(SurveyDto dto) {
        Survey survey = modelMapper.map(dto, Survey.class);
        survey.setOptions(dto.getOptions().stream().map(o -> modelMapper.map(o, SurveyOption.class)).toList());
        // Handle matrix columns conversion from list to string
        if (dto.getMatrixColumns() != null && !dto.getMatrixColumns().isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                String matrixColumns = objectMapper.writeValueAsString(dto.getMatrixColumns());
                survey.setMatrixColumns(matrixColumns);
            } catch (Exception e) {
                // Fallback to empty string if serialization fails
                survey.setMatrixColumns("[]");
            }
        }
        return survey;
    }

    @Override
    public SurveyListItemDto convertToListItemDto(Survey survey) {
        SurveyListItemDto dto = modelMapper.map(survey, SurveyListItemDto.class);
        dto.setVotesCount(
                survey.getOptions() != null ? survey.getOptions().stream().mapToInt(o -> o.getVotes()).sum() : 0);
        dto.setMessagesCount(survey.getMessages() != null ? survey.getMessages().size() : 0);
        return dto;
    }

    @Override
    public List<Survey> findByUser(User user) {
        return fr.getSurveyRepository().findByUserId(user.getId());
    }

    private Sort getSort(String sort) {
        if ("views_desc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.DESC, "views");
        } else if ("views_asc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.ASC, "views");
        } else if ("created_desc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.DESC, "createdAt");
        } else if ("created_asc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.ASC, "createdAt");
        } else if ("title_asc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.ASC, "title");
        } else if ("title_desc".equalsIgnoreCase(sort)) {
            return Sort.by(Direction.DESC, "title");
        }
        // By default, sort by creation date (newest first)
        return Sort.by(Direction.DESC, "createdAt");
    }

    private Survey anonymizeVotes(Survey survey) {
        fr.getVoteRepository().anonymizeVotesBySurveyId(survey.getId());
        survey.getOptions().forEach(o -> {
            o.setVoteValues(fr.getVoteValueRepository().findBySurveyOption(o));
            o.setSurvey(survey);
        });
        return fr.getSurveyRepository().save(survey);
    }

    private Survey resetSurvey(Survey survey) {
        fr.getVoteRepository().deleteBySurveyId(survey.getId());
        fr.getMessageRepository().deleteBySurveyId(survey.getId());
        if (survey.getOptions() != null)
            survey.getOptions().forEach(o -> o.setVotes(0));
        survey.setVotesCount(0);
        survey.setViews(0);
        survey.getOptions().forEach(o -> o.setSurvey(survey));
        return fr.getSurveyRepository().save(survey);
    }
}
