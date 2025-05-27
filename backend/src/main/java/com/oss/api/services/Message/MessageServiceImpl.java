package com.oss.api.services.Message;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.oss.api.dto.MessageDto;
import com.oss.api.models.Message;
import com.oss.api.models.Survey;
import com.oss.api.models.User;
import com.oss.api.repository.factory.FactoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final FactoryRepository fr;
    private final ModelMapper modelMapper;

    @Override
    public Message addMessage(UUID surveyId, String content, User user) {
        Survey survey = fr.getSurveyRepository().findById(surveyId)
                .orElseThrow(() -> new IllegalArgumentException("Опитування не знайдено"));
        return fr.getMessageRepository().save(new Message(survey, user, content));
    }

    @Override
    public List<Message> getMessagesBySurvey(UUID surveyId) {
        return fr.getMessageRepository().findBySurveyId(surveyId);
    }

    @Override
    public MessageDto convertToDto(Message message) {
        return modelMapper.map(message, MessageDto.class);
    }

    @Override
    public Message convertToEntity(MessageDto dto) {
        return modelMapper.map(dto, Message.class);
    }
}