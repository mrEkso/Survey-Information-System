package com.example.oss.controllers;

import com.example.oss.model.Applicant;
import com.example.oss.model.User;
import com.example.oss.model.Vote;
import com.example.oss.model.Voting;
import com.example.oss.services.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
                          @RequestParam(name = "userId") User user,
                          @RequestParam(name = "votingId") Voting voting,
                          @RequestParam(name = "applicantId") Applicant applicant) {
        Vote vote = new Vote(user, voting, applicant);

        if (!voteService.checkVote(vote)) {
            voteService.vote(vote);
        }

        model.addAttribute("AlreadyVote", true);
        model.addAttribute("voteForApplicantName", applicant.getName());
        return "forward:/voting";
    }

    @PostMapping("/unvote")
    protected String unvote(@RequestParam(name = "userId") User user,
                            @RequestParam(name = "votingId") Voting voting) {
        Vote vote = voteService.findByVotingAndUser(voting, user);

        if (voteService.checkVote(vote)) {
            voteService.unvote(vote);
        }

        return "forward:/voting";
    }
}
