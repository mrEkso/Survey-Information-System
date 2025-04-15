package com.example.oss.api.controllers;

import com.example.oss.api.dto.SurveyDto;
import com.example.oss.api.models.Survey;
import com.example.oss.api.models.SurveyOption;
import com.example.oss.api.models.User;
import com.example.oss.api.models.Vote;
import com.example.oss.api.responses.crud.CreateResponse;
import com.example.oss.api.responses.crud.DeleteResponse;
import com.example.oss.api.responses.crud.UpdateResponse;
import com.example.oss.api.services.Applicant.ApplicantService;
import com.example.oss.api.services.Survey.SurveyService;
import com.example.oss.api.services.Vote.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/surveys")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class SurveyController {
    final private SurveyService surveyService;
    final private VoteService voteService;
    final private ApplicantService applicantService;

    @GetMapping({ "", "/search" })
    public ResponseEntity<Page<SurveyDto>> index(
            @RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(surveyService.findAll(searchText, page).map(surveyService::convertToDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> show(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("error.survey.id.empty");
        }
        UUID surveyId = UUID.fromString(id);
        Optional<Survey> survey = surveyService.findById(surveyId);
        if (survey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", 404,
                    "message", "Survey not found"));
        }
        SurveyDto surveyDto = surveyService.convertToDto(survey.get());
        boolean hasVoted = false;
        if (user != null) {
            Vote vote = new Vote(user, survey.get());
            // hasVoted = voteService.checkVote(vote);
        }
        return ResponseEntity.ok(Map.of(
                "survey", surveyDto,
                "hasVoted", hasVoted));
    }

    @PostMapping
    public ResponseEntity<CreateResponse> store(
            @Valid @RequestBody Survey survey,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new CreateResponse(
                surveyService.convertToDto(
                        surveyService.insert(survey, user))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Valid @RequestBody Survey survey,
            @AuthenticationPrincipal User user) {
        Optional<Survey> existingSurvey = surveyService.findById(survey.getId());
        if (!existingSurvey.get().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("error.survey.not.owner");
        }
        return ResponseEntity.ok(new UpdateResponse(
                surveyService.convertToDto(
                        surveyService.update(survey, user))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> destroy(@PathVariable UUID id) {
        Optional<Survey> survey = surveyService.findById(id);
        if (survey.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        surveyService.delete(survey.get());
        return ResponseEntity.ok(new DeleteResponse());
    }

    @GetMapping("/my")
    public ResponseEntity<Page<SurveyDto>> mySurveys(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(surveyService.findByUser(user, page).map(surveyService::convertToDto));
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<?> surveyResult(@PathVariable UUID id) {
        Optional<Survey> survey = surveyService.findById(id);
        if (survey.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<SurveyOption> applicants = applicantService.getByVotingId(id);
        return ResponseEntity.ok(Map.of(
                "survey", surveyService.convertToDto(survey.get()),
                "options", applicants));
    }
}
