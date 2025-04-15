package com.example.oss.api.services.User;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.models.User;
import com.example.oss.api.repository.factory.FactoryRepository;
import com.example.oss.api.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor_ = @Lazy)
public class UserServiceImpl implements UserService {
    private final FactoryRepository fr;
    private final JwtTokenProvider jwtTokenProvider;
    private final ModelMapper modelMapper;

    private final int PAGE_SIZE = 10;

    @Override
    public Page<User> findAll(String searchText, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        if (searchText == null || searchText.isEmpty())
            return fr.getUserRepository().findAll(pageable);
        return fr.getUserRepository().findByUsername(pageable, searchText);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return fr.getUserRepository().findById(id);
    }

    @Override
    public User insert(User user) {
        user.setPassword(encoder().encode(user.getPassword()));
        user.setToken(jwtTokenProvider.createToken(user));
        return fr.getUserRepository().save(user);
    }

    @Override
    public User update(User user) {
        if (user.getPassword() != null
                && !encoder().encode(user.getPassword()).equals(loadUserByUsername(user.getEmail()).getPassword()))
            user.setPassword(encoder().encode(user.getPassword()));
        return fr.getUserRepository().save(user);
    }

    @Override
    public void delete(User user) {
        fr.getUserRepository().delete(user);
    }

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        return fr.getUserRepository().findByEmail(email);
    }

    @Override
    public boolean checkPassword(User user, String password) {
        return !encoder().matches(password, loadUserByUsername(user.getEmail()).getPassword());
    }

    @Override
    public User register(User user) {
        user.setPassword(encoder().encode(user.getPassword()));
        user.setToken(jwtTokenProvider.createToken(user));
        return fr.getUserRepository().save(user);
    }

    @Override
    public UserDto convertToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public User convertToEntity(UserDto userDto) {
        return modelMapper.map(userDto, User.class);
    }

    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}
