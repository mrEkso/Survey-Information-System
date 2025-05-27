package com.oss.api.services.Vote;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.OptimisticLockException;

import com.oss.api.dto.VoteDto;
import com.oss.api.dto.VoteValueDto;
import com.oss.api.models.Survey;
import com.oss.api.models.SurveyOption;
import com.oss.api.models.User;
import com.oss.api.models.Vote;
import com.oss.api.models.VoteValue;
import com.oss.api.repository.factory.FactoryRepository;
import com.oss.api.services.VoteValue.VoteValueService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor_ = @Lazy)
public class VoteServiceImpl implements VoteService {
    private final FactoryRepository fr;
    private final ModelMapper modelMapper;
    private final VoteValueService voteValueService;

    @Override
    public Vote findById(UUID id) {
        return fr.getVoteRepository().findById(id)
                .orElseThrow(() -> new NullPointerException("Голос не знайдено"));
    }

    @Override
    public Vote findBySurveyAndUser(Survey survey, User user) {
        return fr.getVoteRepository().findBySurveyAndUser(survey, user).orElse(null);
    }

    @Override
    public List<Vote> findBySurvey(Survey survey) {
        return fr.getVoteRepository().findBySurveyIdOrderByCreatedAtAsc(survey.getId());
    }

    @Override
    public boolean checkVote(Survey survey, User user) {
        return findBySurveyAndUser(survey, user) != null;
    }

    @Override
    @Retryable(value = { ObjectOptimisticLockingFailureException.class, OptimisticLockException.class,
            CannotAcquireLockException.class }, maxAttempts = 3, backoff = @Backoff(delay = 200, multiplier = 2))
    @Transactional(isolation = Isolation.READ_COMMITTED, timeout = 5)
    public Vote handleVote(UUID surveyId, UUID surveyOptionId, List<VoteValueDto> voteValues, User user) {
        if (user == null)
            throw new IllegalArgumentException("Будь ласка, авторизуйтесь для голосування");
        Survey survey = fr.getSurveyRepository().findById(surveyId)
                .orElseThrow(() -> new NullPointerException("Опитування не знайдено"));
        if (!survey.isOpen())
            throw new IllegalArgumentException("Голосування закрито");
        if (checkVote(survey, user))
            throw new IllegalArgumentException("Ви вже відповіли на це опитування");
        Vote vote = new Vote(user, survey);
        // Validate that all options belong to this survey
        Optional.ofNullable(voteValues).orElse(List.of()).forEach(v -> {
            if (survey.getOptions().stream().map(SurveyOption::getId).noneMatch(id -> id.equals(v.getSurveyOptionId())))
                throw new IllegalArgumentException("Один або більше варіантів не належать до цього опитування");
        });
        switch (survey.getSurveyType()) {
            case SINGLE_CHOICE:
                if (surveyOptionId == null)
                    throw new IllegalArgumentException("Необхідно вибрати один варіант");
                vote.setSurveyOption(survey.getOptions().stream()
                        .filter(opt -> opt.getId().equals(surveyOptionId)).findFirst()
                        .orElseThrow(() -> new RuntimeException("Варіант відповіді не знайдено")));
                vote(vote, user);
                break;
            case MULTIPLE_CHOICE:
                if (voteValues == null || voteValues.isEmpty())
                    throw new IllegalArgumentException("Необхідно вибрати хоча б один варіант");
                voteWithValues(vote, voteValues, user);
                break;
            case RATING_SCALE:
                if (voteValues == null || voteValues.isEmpty())
                    throw new IllegalArgumentException("Необхідно вказати хоча б одне значення");
                Integer min = survey.getMinRating() != null ? survey.getMinRating() : 1;
                Integer max = survey.getMaxRating() != null ? survey.getMaxRating() : 5;
                if (voteValues.size() != survey.getOptions().size() ||
                        survey.getOptions().stream().anyMatch(option -> voteValues.stream().noneMatch(
                                value -> value.getSurveyOptionId().equals(option.getId())
                                        && value.getNumericValue() != null))) {
                    throw new IllegalArgumentException("Потрібно оцінити кожен елемент!");
                }
                voteValues.forEach(v -> {
                    if (v.getNumericValue() == null || v.getNumericValue() < min || v.getNumericValue() > max)
                        throw new IllegalArgumentException("Оцінка повинна бути від " + min + " до " + max);
                });
                voteWithValues(vote, voteValues, user);
                break;
            case MATRIX:
                if (voteValues == null || voteValues.isEmpty())
                    throw new IllegalArgumentException("Необхідно заповнити матрицю");
                voteWithValues(vote, voteValues, user);
                break;
            case RANKING:
                if (voteValues == null || voteValues.isEmpty())
                    throw new IllegalArgumentException("Необхідно вказати ранжування");
                voteWithValues(vote, voteValues, user);
                break;
            default:
                throw new IllegalArgumentException("Непідтримуваний тип опитування");
        }
        fr.getSurveyRepository().incrementVotes(survey.getId());
        return findBySurveyAndUser(survey, user);
    }

    @Transactional
    private void vote(Vote vote, User user) {
        SurveyOption surveyOptionDb = fr.getSurveyOptionRepository()
                .findById(vote.getSurveyOption().getId())
                .orElseThrow(() -> new NullPointerException("Варіант відповіді не знайдено"));
        fr.getSurveyOptionRepository().incrementVotes(surveyOptionDb.getId());
        fr.getVoteRepository().save(new Vote(user, surveyOptionDb.getSurvey(), surveyOptionDb));
    }

    @Transactional
    private void voteWithValues(Vote vote, List<VoteValueDto> voteValues, User user) {
        Survey survey = fr.getSurveyRepository()
                .findById(vote.getSurvey().getId())
                .orElseThrow(() -> new NullPointerException("Опитування не знайдено"));
        // Create a new vote without a specific option (for multi-option votes)
        Vote savedVote = fr.getVoteRepository().save(new Vote(user, survey));
        // Save each vote value
        for (VoteValueDto valueDto : voteValues) {
            SurveyOption option = fr.getSurveyOptionRepository()
                    .findById(valueDto.getSurveyOptionId())
                    .orElseThrow(() -> new NullPointerException("Варіант відповіді не знайдено"));
            voteValueService
                    .save(new VoteValue(savedVote, option, valueDto.getNumericValue(), valueDto.getRankPosition()));
            fr.getSurveyOptionRepository().incrementVotes(option.getId());
        }
    }

    @Override
    @Retryable(value = { ObjectOptimisticLockingFailureException.class, OptimisticLockException.class,
            CannotAcquireLockException.class }, maxAttempts = 3, backoff = @Backoff(delay = 200, multiplier = 2))
    @Transactional(isolation = Isolation.READ_COMMITTED, timeout = 5)
    public void handleUnvote(UUID surveyId, User user) {
        if (user == null)
            throw new IllegalArgumentException("Будь ласка, авторизуйтесь для голосування");
        Survey survey = fr.getSurveyRepository()
                .findById(surveyId)
                .orElseThrow(() -> new NullPointerException("Опитування не знайдено"));
        if (!survey.isOpen())
            throw new IllegalArgumentException("Голосування закрито");
        if (!checkVote(survey, user))
            throw new IllegalArgumentException("Ви ще не голосували в цьому опитуванні");
        unvote(survey, user);
    }

    @Transactional
    public void unvote(Survey survey, User user) {
        Vote vote = findBySurveyAndUser(survey, user);
        voteValueService.deleteByVote(vote);
        if (vote.getSurveyOption() != null) {
            fr.getSurveyOptionRepository().decrementVotes(vote.getSurveyOption().getId());
        } else {
            vote.getVoteValues().forEach(voteValue -> {
                fr.getSurveyOptionRepository().decrementVotes(voteValue.getSurveyOption().getId());
            });
        }
        fr.getSurveyRepository().decrementVotes(survey.getId());
        fr.getVoteRepository().delete(vote);
    }

    @Override
    public VoteDto convertToDto(Vote vote) {
        return modelMapper.map(vote, VoteDto.class);
    }

    @Override
    public Vote convertToEntity(VoteDto voteDto) {
        return modelMapper.map(voteDto, Vote.class);
    }
}
