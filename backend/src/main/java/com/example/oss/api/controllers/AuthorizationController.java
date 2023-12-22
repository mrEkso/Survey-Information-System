package com.example.oss.api.controllers;

import com.example.oss.api.responses.auth.LoginResponse;
import com.example.oss.api.responses.auth.LogoutResponse;
import com.example.oss.api.responses.auth.RegisterResponse;
import com.example.oss.api.models.User;
import com.example.oss.api.services.User.UserService;
import jakarta.security.auth.message.AuthException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthorizationController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseBody
    protected RegisterResponse register(@Valid @RequestBody User user) {
        User dbUser = userService.register(user);
        return new RegisterResponse(
                userService.convertToDto(dbUser),
                dbUser.getToken()
        );
    }

    @PostMapping("/login")
    @ResponseBody
    public LoginResponse login(@Valid @RequestBody User user) throws AuthException {
        User dbUser = userService.loadUserByUsername(user.getEmail());

        if (dbUser == null || userService.checkPassword(dbUser, user.getPassword()))
            throw new AuthException();

        return new LoginResponse(
                userService.convertToDto(dbUser),
                dbUser.getToken()
        );
    }

    @GetMapping("/logout")
    @ResponseBody
    protected LogoutResponse logout() {
        return new LogoutResponse();
    }
}
