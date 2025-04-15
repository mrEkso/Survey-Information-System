package com.example.oss.api.controllers;

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
    public ResponseEntity<Page<Survey>> index(
            @RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(surveyService.findAll(searchText, page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> show(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "message", "Survey ID cannot be null or empty"));
        }
        UUID surveyId = UUID.fromString(id);
        Optional<Survey> survey = surveyService.findById(surveyId);
        if (survey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", 404,
                    "message", "Survey not found"));
        }
        Survey surveyData = survey.get();
        boolean hasVoted = false;
        if (user != null) {
            Vote vote = new Vote(user, surveyData);
            // hasVoted = voteService.checkVote(vote);
        }
        return ResponseEntity.ok(Map.of(
                "survey", surveyData,
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
    public ResponseEntity<UpdateResponse> update(
            @Valid @RequestBody Survey survey,
            @AuthenticationPrincipal User user) {
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
    public ResponseEntity<List<Survey>> mySurveys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(surveyService.findByUser(user));
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<?> surveyResult(@PathVariable UUID id) {
        Optional<Survey> survey = surveyService.findById(id);
        if (survey.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<SurveyOption> applicants = applicantService.getByVotingId(id);
        return ResponseEntity.ok(Map.of(
                "survey", survey.get(),
                "options", applicants));
    }
}
