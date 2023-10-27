package com.example.oss.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.Instant;

@Entity
@Getter
@Table(name = "votings")
public class Voting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private final User user;

    @NotBlank
    @Size(max = 100)
    private final String title;

    @NotBlank
    @Size(max = 500)
    private final String subtitle;

    @CreatedDate
    private Instant createdAt;

    @Setter
    private boolean on;

    public Voting(Integer id, User user, String title, String subtitle, boolean on) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.subtitle = subtitle;
        this.on = on;
    }

    public Voting(User user, String title, String subtitle, boolean on) {
        this.user = user;
        this.title = title;
        this.subtitle = subtitle;
        this.on = on;
    }
}
