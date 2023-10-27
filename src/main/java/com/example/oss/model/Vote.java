package com.example.oss.model;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "user_id",
                "voting_id"
        })
})
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private final User user;

    @ManyToOne(cascade = CascadeType.REMOVE,
            fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "voting_id", nullable = false)
    private final Voting voting;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "applicant_id", nullable = false)
    private Applicant applicant;

    public Vote(User user, Voting voting, Applicant applicant) {
        this.user = user;
        this.voting = voting;
        this.applicant = applicant;
    }

    public Vote(User user, Voting voting) {
        this.user = user;
        this.voting = voting;
    }
}
