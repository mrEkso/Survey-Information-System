package com.example.oss.api.controllers;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.models.User;
import com.example.oss.api.requests.GrantAdminRoleRequest;
import com.example.oss.api.responses.crud.CreateResponse;
import com.example.oss.api.responses.crud.DeleteResponse;
import com.example.oss.api.responses.crud.UpdateResponse;
import com.example.oss.api.services.User.UserService;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class UserController {
    private final UserService userService;

    @GetMapping({ "", "/search" })
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    protected Page<User> index(@RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "0") int page) {
        return userService.findAll(searchText, page);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    protected User show(@PathVariable UUID id) {
        Optional<User> user = userService.findById(id);
        if (user.isEmpty())
            throw new NullPointerException("Користувача з таким ідентифікатором не знайдено");
        return user.get();
    }

    @PostMapping
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    protected CreateResponse store(@Valid @RequestBody User user) {
        return new CreateResponse(
                userService.convertToDto(
                        userService.insert(user)));
    }

    @PutMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    protected UpdateResponse update(@Valid @RequestBody User user) {
        return new UpdateResponse(
                userService.convertToDto(
                        userService.update(user)));
    }

    @DeleteMapping
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    protected DeleteResponse destroy(@RequestParam(name = "userId") User user) {
        userService.delete(user);
        return new DeleteResponse();
    }

    @PostMapping("/grant-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto grantAdminRole(@Valid @RequestBody GrantAdminRoleRequest request) {
        String email = request.getEmail();
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("Email є обов'язковим полем");
        return userService.convertToDto(userService.grantAdminRoleByEmail(email));
    }

    // --- 2FA ---
    @PostMapping("/2fa/enable")
    public Map<String, String> enable2FA(@AuthenticationPrincipal User user) {
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        user.setTwoFactorSecret(key.getKey());
        user.setTwoFactorEnabled(true);
        userService.update(user);
        String qrUrl = String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s",
                "OnlineSurveySystem", user.getEmail(), key.getKey(), "OnlineSurveySystem");
        return Map.of("secret", key.getKey(), "qrUrl", qrUrl);
    }

    @PostMapping("/2fa/disable")
    public Map<String, String> disable2FA(@AuthenticationPrincipal User user) {
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userService.update(user);
        return Map.of("status", "2FA disabled");
    }

    @PostMapping("/2fa/verify")
    public Map<String, Object> verify2FA(@AuthenticationPrincipal User user, @RequestParam int code) {
        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            return Map.of("verified", false, "reason", "2FA not enabled");
        }
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        boolean isCodeValid = gAuth.authorize(user.getTwoFactorSecret(), code);
        return Map.of("verified", isCodeValid);
    }

    @GetMapping("/me")
    @ResponseBody
    public UserDto me(@AuthenticationPrincipal User user) {
        return userService.convertToDto(user);
    }
}
