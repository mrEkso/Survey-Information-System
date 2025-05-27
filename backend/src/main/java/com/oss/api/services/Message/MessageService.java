package com.oss.api.services.Message;

import java.util.List;
import java.util.UUID;

import com.oss.api.dto.MessageDto;
import com.oss.api.models.Message;
import com.oss.api.models.User;
import com.oss.api.services.modelMapperable;

public interface MessageService extends modelMapperable<Message, MessageDto> {
    Message addMessage(UUID surveyId, String content, User user);

    List<Message> getMessagesBySurvey(UUID surveyId);
}