package com.example.oss.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.oss.api.models.User;
import com.example.oss.api.requests.LoginRequest;
import com.example.oss.api.requests.RegisterRequest;
import com.example.oss.api.requests.Verify2faRegisterRequest;
import com.example.oss.api.responses.auth.LoginResponse;
import com.example.oss.api.responses.auth.LogoutResponse;
import com.example.oss.api.responses.auth.RegisterResponse;
import com.example.oss.api.security.jwt.JwtTokenProvider;
import com.example.oss.api.services.User.UserService;
import com.warrenstrange.googleauth.GoogleAuthenticator;

import jakarta.security.auth.message.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthorizationController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    @ResponseBody
    protected RegisterResponse register(@Valid @RequestBody RegisterRequest registerRequest) throws AuthException {
        if (userService.loadUserByUsername(registerRequest.getUser().getEmail()) != null)
            throw new AuthException("Користувач з такою електронною поштою вже існує");
        // Generate 2FA secret, but don't save user
        String secret = new GoogleAuthenticator().createCredentials().getKey();
        String qrUrl = String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s",
                "Система онлайн-опитувань", registerRequest.getUser().getEmail(), secret, "Система онлайн-опитувань");
        // Return temporary token
        String tempToken = jwtTokenProvider.create2FAPendingTokenRaw(registerRequest.getUser().getEmail(), secret,
                registerRequest.getUser().getNickname(), registerRequest.getUser().getPassword());
        // Don't return user until 2FA is verified
        return new RegisterResponse(tempToken, secret, qrUrl);
    }

    @PostMapping("/login")
    @ResponseBody
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest) throws AuthException {
        User dbUser = userService.loadUserByUsername(loginRequest.getEmail());
        if (dbUser == null || !userService.checkPassword(dbUser, loginRequest.getPassword()))
            throw new AuthException("Невірний логін або пароль");
        if (dbUser.isTwoFactorEnabled())
            // Don't return user until 2FA is verified
            return new LoginResponse(jwtTokenProvider.create2FAPendingToken(dbUser), true);
        return new LoginResponse(userService.convertToDto(dbUser), jwtTokenProvider.createToken(dbUser), false);
    }

    @PostMapping("/2fa/verify")
    @ResponseBody
    public LoginResponse verify2fa(@Valid @RequestBody Verify2faRegisterRequest verifyRequest) throws AuthException {
        String email = jwtTokenProvider.extractUsername(verifyRequest.getToken());
        User dbUser = userService.loadUserByUsername(email);
        String code = verifyRequest.getCode();
        // 2FA for login
        if (dbUser != null && dbUser.isTwoFactorEnabled()) {
            String secret = dbUser.getTwoFactorSecret();
            if (secret == null)
                throw new AuthException("2FA секрет не знайдено для цього користувача");
            if (!new GoogleAuthenticator().authorize(secret, Integer.parseInt(code)))
                throw new AuthException("Невірний 2FA код");
            return new LoginResponse(userService.convertToDto(dbUser), jwtTokenProvider.createToken(dbUser), false);
        }
        // 2FA for registration
        String secret = jwtTokenProvider.extract2FASecret(verifyRequest.getToken());
        if (secret == null)
            throw new AuthException("2FA секрет не знайдено в токені");
        if (!new GoogleAuthenticator().authorize(secret, Integer.parseInt(code)))
            throw new AuthException("Невірний 2FA код");
        User newUser = userService.register(new User(jwtTokenProvider.extract2FANickname(verifyRequest.getToken()),
                email, jwtTokenProvider.extract2FAPassword(verifyRequest.getToken()), secret, true));
        return new LoginResponse(userService.convertToDto(newUser), jwtTokenProvider.createToken(newUser), false);
    }

    @PostMapping("/logout")
    @ResponseBody
    public LogoutResponse logout(HttpServletRequest request, HttpServletResponse response, Authentication user)
            throws AuthException {
        if (user == null)
            throw new AuthException("Користувач не знайдено");
        new SecurityContextLogoutHandler().logout(request, response, user);
        return new LogoutResponse();
    }
}
