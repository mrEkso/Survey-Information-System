package com.example.oss.api.responses.auth;

import com.example.oss.api.dto.UserDto;
import com.example.oss.api.responses.BaseAuthResponse;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * LoginResponse: if twoFaRequired=true, then user is always null (user data is
 * not returned until 2FA is verified).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse extends BaseAuthResponse {
    private final Boolean twoFaRequired;

    public LoginResponse(UserDto user, String token, boolean twoFaRequired) {
        super(200, "Ви успішно увійшли в систему", user, token);
        this.twoFaRequired = twoFaRequired;
    }

    public LoginResponse(String token, boolean twoFaRequired) {
        super(200, twoFaRequired ? "Потрібна 2FA" : "Ви успішно увійшли в систему", null, token);
        this.twoFaRequired = twoFaRequired;
    }

    public Boolean getTwoFaRequired() {
        return twoFaRequired;
    }
}
