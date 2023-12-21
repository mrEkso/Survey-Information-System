package com.example.oss.api.controllers;

import com.example.oss.api.models.Vote;
import com.example.oss.api.services.Vote.VoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VoteController {
    final private VoteService voteService;

    @Autowired
    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/vote")
    protected String vote(Model model,
                          @Valid @RequestBody Vote vote) {
        if (!voteService.checkVote(vote)) {
            voteService.vote(vote);
        }

        model.addAttribute("AlreadyVote", true);
        model.addAttribute("voteForApplicantName", vote.getApplicant().getName());
        return "forward:/voting";
    }

    @PostMapping("/unvote")
    protected String unvote(@Valid @RequestBody Vote vote) {
        if (voteService.checkVote(vote)) voteService.unvote(vote);
        return "forward:/voting";
    }
}
