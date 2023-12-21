package com.example.oss.api.responses.auth;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.responses.BaseAuthResponse;

public class LoginResponse extends BaseAuthResponse {
    public LoginResponse(UserDto user, String token) {
        super(200, "login", user, token);
    }
}
