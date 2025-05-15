package com.example.oss.api.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.oss.api.dto.SurveyDto;
import com.example.oss.api.dto.SurveyListItemDto;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import com.example.oss.api.responses.crud.CreateResponse;
import com.example.oss.api.responses.crud.DeleteResponse;
import com.example.oss.api.responses.crud.UpdateResponse;
import com.example.oss.api.services.Message.MessageService;
import com.example.oss.api.services.Survey.SurveyService;
import com.example.oss.api.services.SurveyOption.SurveyOptionService;
import com.example.oss.api.services.Vote.VoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/surveys")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class SurveyController {
    private final SurveyService surveyService;
    private final SurveyOptionService surveyOptionService;
    private final MessageService messageService;
    private final VoteService voteService;

    @GetMapping({ "", "/search" })
    public ResponseEntity<Page<SurveyListItemDto>> index(@RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Boolean open,
            @RequestParam(required = false) String sort) {
        return ResponseEntity
                .ok(surveyService.findAll(searchText, page, open, sort).map(surveyService::convertToListItemDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable String id, @AuthenticationPrincipal User user) {
        Survey survey = surveyService.findByIdWithIncrementViews(UUID.fromString(id), user);
        Map<String, Object> response = new HashMap<>();
        response.put("survey", surveyService.convertToDto(survey));
        if (user != null) {
            Vote vote = voteService.findBySurveyAndUser(survey, user);
            response.put("vote", vote != null ? voteService.convertToDto(vote) : null);
        }
        if (user != null && user.getId().equals(survey.getUser().getId()))
            response.put("messages", messageService.getMessagesBySurvey(survey.getId()).stream()
                    .map(messageService::convertToDto).toList());
        if (!survey.isOpen())
            response.put("votes", voteService.findBySurvey(survey).stream()
                    .map(voteService::convertToDto).toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> store(@Valid @RequestBody SurveyDto surveyDto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new CreateResponse(surveyService.convertToDto(surveyService.create(surveyDto, user))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@messageSecurity.isSurveyOwner(#surveyDto.id, principal)")
    public ResponseEntity<UpdateResponse> update(@Valid @RequestBody SurveyDto surveyDto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new UpdateResponse(surveyService.convertToDto(surveyService.update(surveyDto, user))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@messageSecurity.isSurveyOwner(#id, principal)")
    public ResponseEntity<DeleteResponse> destroy(@PathVariable UUID id, @AuthenticationPrincipal User user)
            throws IOException {
        surveyService.delete(id);
        return ResponseEntity.ok(new DeleteResponse());
    }

    @GetMapping("/my")
    public ResponseEntity<Page<SurveyDto>> mySurveys(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) Boolean open,
            @RequestParam(required = false) String sort) {
        return ResponseEntity
                .ok(surveyService.findByUser(user, page, searchText, open, sort).map(surveyService::convertToDto));
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<?> surveyResult(@PathVariable UUID id) {
        Survey survey = surveyService.findById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("survey", surveyService.convertToDto(survey));
        response.put("surveyOptions", survey.getOptions().stream().map(surveyOptionService::convertToDto).toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@messageSecurity.isSurveyOwner(#id, principal)")
    public ResponseEntity<SurveyDto> uploadImage(@PathVariable String id,
            @RequestParam("image") MultipartFile image, @AuthenticationPrincipal User user) throws IOException {
        return ResponseEntity.ok(surveyService.convertToDto(surveyService.uploadSurveyImage(id, image, user)));
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws IOException {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(surveyService.getSurveyImage(fileName));
    }

    @GetMapping("/my-all")
    public ResponseEntity<List<SurveyDto>> allMySurveys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(surveyService.findByUser(user).stream().map(surveyService::convertToDto).toList());
    }
}