package com.example.oss.api.controllers;

import com.example.oss.api.models.User;
import com.example.oss.api.responses.crud.CreateResponse;
import com.example.oss.api.responses.crud.DeleteResponse;
import com.example.oss.api.responses.crud.UpdateResponse;
import com.example.oss.api.services.User.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

import static com.example.oss.api.lang.LocalizationService.toLocale;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class UserController {
    private final UserService userService;

    @GetMapping({"", "/search"})
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    protected Page<User> index(@RequestParam(required = false) String searchText,
                               @RequestParam(defaultValue = "0") int page) {
        return userService.findAll(searchText, page);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    protected User show(@PathVariable UUID id) {
        Optional<User> user = userService.findById(id);
        if (user.isEmpty())
            throw new NullPointerException(toLocale("error.user.id.not.found"));
        return user.get();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    protected CreateResponse store(@Valid @RequestBody User user) {
        return new CreateResponse(
                userService.convertToDto(
                        userService.insert(user)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    protected UpdateResponse update(@Valid @RequestBody User user) {
        return new UpdateResponse(
                userService.convertToDto(
                        userService.update(user)));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    protected DeleteResponse destroy(@RequestParam(name = "userId") User user) {
        userService.delete(user);
        return new DeleteResponse();
    }
}
