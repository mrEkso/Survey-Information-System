package com.example.oss.api.models;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "email"
        })
})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(unique = true)
    @Size(max = 50)
    private String nickname;

    @NotBlank(message = "Адрес електронної пошти не може бути пустим")
    @Column(unique = true)
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank(message = "Пароль не може бути пустим")
    @Size(max = 100)
    @Setter
    private String password;

    @Setter
    private String token;

    @Column(name = "two_factor_secret", nullable = true)
    private String twoFactorSecret;

    @Column(name = "two_factor_enabled", columnDefinition = "boolean default false")
    private boolean twoFactorEnabled = false;

    public static final int ROLE_ADMIN = 1;
    public static final int ROLE_USER = 2;
    private int role = ROLE_USER;

    public User(String nickname, String email, String password, String twoFactorSecret,
            boolean twoFactorEnabled) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.twoFactorSecret = twoFactorSecret;
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public User(String nickname, String email, String password, String token) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.token = token;
    }

    public User(String nickname, String email, String password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    public User(String email, String password, int role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + (role == ROLE_ADMIN ? "ADMIN" : "USER")));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getNickname() {
        return this.nickname;
    }

    public void setRole(int role) {
        this.role = role;
    }

    // For UserDetails: getUsername() returns email (used for login)
    @Override
    public String getUsername() {
        return this.email;
    }

    public boolean isAdmin() {
        return this.role == ROLE_ADMIN;
    }

    public void setTwoFactorSecret(String twoFactorSecret) {
        this.twoFactorSecret = twoFactorSecret;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }
}
