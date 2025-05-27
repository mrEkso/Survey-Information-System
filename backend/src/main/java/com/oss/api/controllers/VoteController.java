package com.oss.api.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oss.api.models.User;
import com.oss.api.requests.UniversalVoteRequest;
import com.oss.api.responses.BaseResponse;
import com.oss.api.responses.BaseResponseWithData;
import com.oss.api.services.Vote.VoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vote")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class VoteController {
    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<?> vote(
            @Valid @RequestBody UniversalVoteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity
                .ok(new BaseResponseWithData(200, "Ваша відповідь успішно врахована",
                        voteService.convertToDto(voteService.handleVote(
                                request.getSurveyId(), request.getSurveyOptionId(), request.getVoteValues(), user))));
    }

    @DeleteMapping("/{surveyId}")
    public ResponseEntity<?> unvote(
            @PathVariable UUID surveyId,
            @AuthenticationPrincipal User user) {
        voteService.handleUnvote(surveyId, user);
        return ResponseEntity.ok(new BaseResponse(200, "Ваша відповідь успішно видалена"));
    }
}
