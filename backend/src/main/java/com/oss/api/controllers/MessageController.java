package com.oss.api.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oss.api.dto.MessageDto;
import com.oss.api.models.User;
import com.oss.api.requests.MessageRequest;
import com.oss.api.responses.crud.CreateResponse;
import com.oss.api.services.Message.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("isAuthenticated() and !@messageSecurity.isSurveyOwner(#request.surveyId, principal)")
    public ResponseEntity<CreateResponse> addMessage(
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new CreateResponse(messageService.convertToDto(
                messageService.addMessage(request.getSurveyId(), request.getContent(), user))));
    }

    @GetMapping("/{surveyId}")
    @PreAuthorize("hasRole('ADMIN') or @messageSecurity.isSurveyOwner(#surveyId, principal)")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable UUID surveyId) {
        return ResponseEntity.ok(messageService.getMessagesBySurvey(surveyId).stream()
                .map(messageService::convertToDto)
                .collect(Collectors.toList()));
    }
}