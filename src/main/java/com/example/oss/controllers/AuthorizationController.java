package com.example.oss.controllers;

import com.example.oss.model.User;
import com.example.oss.model.Voting;
import com.example.oss.services.UserService;
import com.example.oss.services.VotingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class AuthorizationController {
    private final VotingService votingService;
    private final UserService userService;

    @Autowired
    public AuthorizationController(VotingService votingService, UserService userService) {
        this.votingService = votingService;
        this.userService = userService;
    }

    @PostMapping(value = "/login")
    protected ResponseEntity<?> login(@RequestParam(name = "login") String login,
                                      @RequestParam(name = "password") String password,
                                      HttpServletRequest request) {
        User user = userService.getByLogin(login);
        if (user == null) {
            return new ResponseEntity<>("Вибачте, проте користувача з логіном: " + login + ", не існує :(",
                    HttpStatus.NOT_FOUND);
        }
        if (!userService.checkPassword(user, password)) {
            return new ResponseEntity<>("Неправильний пароль :(", HttpStatus.UNAUTHORIZED);
        }

        request.getSession().setAttribute("user", user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/logout")
    protected ResponseEntity<List<Voting>> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return new ResponseEntity<>(votingService.getAll(), HttpStatus.OK);
    }

    @PostMapping("/register")
    protected ResponseEntity<?> register(HttpServletRequest request,
                                         @RequestParam(name = "login") String login,
                                         @RequestParam(name = "password") String password) {
        request.getSession().invalidate();

        if (!userService.checkForLogin(login)) {
            User user = new User(login, password);
            userService.insert(user);
            request.getSession().setAttribute("user", user);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
