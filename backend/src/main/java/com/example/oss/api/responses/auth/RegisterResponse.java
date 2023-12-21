package com.example.oss.api.responses.auth;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.responses.BaseAuthResponse;

public class RegisterResponse extends BaseAuthResponse {
    public RegisterResponse(UserDto user, String token) {
        super(201, "register", user, token);
    }
}
