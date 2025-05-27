package com.oss.api.requests;

import com.oss.api.models.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Нікнейм не може бути пустим")
    @Size(max = 50)
    private String nickname;

    @NotBlank(message = "Адрес електронної пошти не може бути пустим")
    @Email(message = "Потрібно подати поле в форматі адресу електронної пошти")
    @Size(max = 100)
    private String email;

    @NotBlank(message = "Пароль не може бути пустим")
    @Size(min = 6, max = 100)
    private String password;

    public User getUser() {
        return new User(nickname, email, password);
    }
}