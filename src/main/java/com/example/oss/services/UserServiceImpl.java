package com.example.oss.services;

import com.example.oss.repository.factory.FactoryRepository;
import com.example.oss.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final FactoryRepository fr;

    @Autowired
    public UserServiceImpl(FactoryRepository factoryRepository) {
        this.fr = factoryRepository;
    }

    @Override
    public User getByLogin(String login) {
        return fr.getUserRepository().getByLogin(login);
    }

    @Override
    public boolean checkForLogin(String login) {
        return getByLogin(login) != null;
    }

    @Override
    public boolean checkPassword(User user, String password) {
        return getByLogin(user.getLogin()).getPassword().equals(password);
    }

    @Override
    public void insert(User user) {
        fr.getUserRepository().save(user);
    }
}
