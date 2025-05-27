package com.oss.api.responses.auth;

import com.oss.api.dto.UserDto;
import com.oss.api.responses.BaseAuthResponse;

/**
 * RegisterResponse: if a temporary token for 2FA is returned, then the user
 * is always null (user data is not returned until 2FA is verified).
 */
public class RegisterResponse extends BaseAuthResponse {
    private String secret;
    private String qrUrl;

    public RegisterResponse(UserDto user, String token) {
        super(201, "Ви успішно зареєструвалися в системі", user, token);
    }

    public RegisterResponse(String token, String secret, String qrUrl) {
        super(201, "Ви успішно зареєструвалися в системі", null, token);
        this.secret = secret;
        this.qrUrl = qrUrl;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getQrUrl() {
        return qrUrl;
    }

    public void setQrUrl(String qrUrl) {
        this.qrUrl = qrUrl;
    }
}
