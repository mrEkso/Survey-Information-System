package com.example.oss.api.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.oss.api.models.User;
import com.example.oss.api.services.User.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {
    @Value("${app.jwt.secret}")
    private String secret;

    private final UserService userService;
    private JwtParser jwtParser;

    @PostConstruct
    private void init() {
        this.jwtParser = Jwts.parser().setSigningKey(secret);
    }

    public String createToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String create2FAPendingToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("2fa_pending", true)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String create2FAPendingTokenRaw(String email, String secret, String nickname, String password) {
        return Jwts.builder()
                .setSubject(email)
                .claim("2fa_pending", true)
                .claim("2fa_secret", secret)
                .claim("2fa_nickname", nickname)
                .claim("2fa_password", password)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, this.secret)
                .compact();
    }

    private Claims parseJwtClaims(String token) {
        return jwtParser.parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token) {
        try {
            String emailFromToken = extractUsername(token);
            if (emailFromToken == null) {
                return false;
            }
            User user = extractUser(token);
            return user != null && emailFromToken.equals(user.getEmail());
        } catch (Exception e) {
            return false;
        }
    }

    public User extractUser(String token) {
        return userService.loadUserByUsername(extractUsername(token));
    }

    public String extractUsername(String token) {
        return parseJwtClaims(token).getSubject();
    }

    public boolean is2FAPending(String token) {
        Claims claims = parseJwtClaims(token);
        Object pending = claims.get("2fa_pending");
        return pending != null && Boolean.TRUE.equals(pending);
    }

    public String extract2FASecret(String token) {
        Claims claims = parseJwtClaims(token);
        return (String) claims.get("2fa_secret");
    }

    public String extract2FANickname(String token) {
        Claims claims = parseJwtClaims(token);
        return (String) claims.get("2fa_nickname");
    }

    public String extract2FAPassword(String token) {
        Claims claims = parseJwtClaims(token);
        return (String) claims.get("2fa_password");
    }
}
