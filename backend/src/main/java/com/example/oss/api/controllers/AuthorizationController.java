package com.example.oss.api.controllers;

import com.example.oss.api.models.User;
import com.example.oss.api.requests.LoginRequest;
import com.example.oss.api.requests.RegisterRequest;
import com.example.oss.api.responses.auth.LoginResponse;
import com.example.oss.api.responses.auth.LogoutResponse;
import com.example.oss.api.responses.auth.RegisterResponse;
import com.example.oss.api.services.User.UserService;
import jakarta.security.auth.message.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import static com.example.oss.api.lang.LocalizationService.toLocale;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthorizationController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseBody
    protected RegisterResponse register(@Valid @RequestBody RegisterRequest registerRequest) {
        User dbUser = userService.register(registerRequest.getUser());
        return new RegisterResponse(
                userService.convertToDto(dbUser),
                dbUser.getToken());
    }

    @PostMapping("/login")
    @ResponseBody
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest) throws AuthException {
        User dbUser = userService.loadUserByUsername(loginRequest.getEmail());
        if (dbUser == null || userService.checkPassword(dbUser, loginRequest.getPassword()))
            throw new AuthException(toLocale("error.login.failed"));
        return new LoginResponse(
                userService.convertToDto(dbUser),
                dbUser.getToken());
    }

    @PostMapping("/logout")
    @ResponseBody
    public LogoutResponse logout(HttpServletRequest request, HttpServletResponse response, Authentication user) {
        if (user != null) {
            new SecurityContextLogoutHandler().logout(request, response, user);
        }
        return new LogoutResponse();
    }
}
