package com.example.oss.controllers;

import com.example.oss.model.Applicant;
import com.example.oss.model.User;
import com.example.oss.model.Vote;
import com.example.oss.model.Voting;
import com.example.oss.services.ApplicantService;
import com.example.oss.services.VoteService;
import com.example.oss.services.VotingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class VotingsController {
    final private VotingService votingService;
    final private VoteService voteService;
    final private ApplicantService applicantService;

    @Autowired
    public VotingsController(VotingService votingService, VoteService voteService, ApplicantService applicantService) {
        this.votingService = votingService;
        this.voteService = voteService;
        this.applicantService = applicantService;
    }

    @GetMapping(value = {"/", "/search"})
    protected ResponseEntity<List<Voting>> votings(
            @RequestParam(name = "searchText", required = false) String searchText) {
        if (searchText != null && !searchText.equals(""))
            return new ResponseEntity<>(votingService.getAll(searchText), HttpStatus.OK);

        return new ResponseEntity<>(votingService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/voting/{id}")
    protected ResponseEntity<?> voting(Model model,
                                       @PathVariable Integer id,
                                       @RequestParam(name = "userId", required = false) User user) {
        Optional<Voting> voting = votingService.getById(id);
        if (voting.isEmpty())
            return new ResponseEntity<>("Голосування з таким id не було знайдено.", HttpStatus.NOT_FOUND);

        Vote vote = new Vote(user, voting.get());
        if (voteService.checkVote(vote)) {
            model.addAttribute("AlreadyVote", true);
        }

        return new ResponseEntity<>(voting.get(), HttpStatus.OK);
    }

    @GetMapping("voting/my")
    protected ResponseEntity<List<Voting>> myVotings(@RequestParam(name = "userId") int userId) {
        return new ResponseEntity<>(votingService.findByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/voting/result")
    protected ResponseEntity<?> resultVoting(@RequestParam(name = "votingId") Voting voting) {
        List<Applicant> applicants = applicantService.getByVotingId(voting.getId());

        return new ResponseEntity<>(List.of(voting, applicants), HttpStatus.OK);
    }

    @PostMapping("/voting")
    protected ResponseEntity<List<Voting>> addVoting(@RequestParam(name = "userId") User user,
                                                     @RequestParam(name = "votingTitle") String votingTitle,
                                                     @RequestParam(name = "votingSubTitle") String votingSubTitle,
                                                     @RequestParam(name = "votingApplicantNames") String votingApplicantNames) {
        Voting voting = new Voting(user, votingTitle, votingSubTitle, true);

        //votingService.insert(voting);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/voting")
    protected ResponseEntity<?> changeVoting(@RequestParam(name = "userId") User user,
                                             @RequestParam(name = "votingId") int votingId,
                                             @RequestParam(name = "votingTitle") String title,
                                             @RequestParam(name = "votingSubTitle") String subTitle,
                                             @RequestParam(name = "votingApplicantNames") String applicantNames,
                                             @RequestParam(name = "votingCondition") String votingCondition) {
        boolean condition = votingCondition.equals("Start");
        Voting voting = new Voting(votingId, user, title, subTitle, condition);

        votingService.update(voting);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/voting")
    protected ResponseEntity<List<Voting>> deleteVoting(@RequestParam(name = "userId") User user,
                                                        @RequestParam(name = "votingId") Voting voting) {
        votingService.delete(voting);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
