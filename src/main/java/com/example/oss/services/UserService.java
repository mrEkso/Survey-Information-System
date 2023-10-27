package com.example.oss.services;

import com.example.oss.model.User;

public interface UserService {
    User getByLogin(String login);

    boolean checkForLogin(String login);

    boolean checkPassword(User user, String password);

    void insert(User user);
}
