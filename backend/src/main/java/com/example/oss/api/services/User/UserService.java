package com.example.oss.api.services.User;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.models.User;
import com.example.oss.api.services.modelMapperable;

@Component
public interface UserService extends UserDetailsService, modelMapperable<User, UserDto> {
    Page<User> findAll(String searchText, int page);

    Optional<User> findById(UUID id);

    User insert(User user);

    User update(User user);

    void delete(User user);

    User loadUserByUsername(String email);

    boolean checkPassword(User user, String password);

    User register(User user);

    User grantAdminRoleByEmail(String email);
}
