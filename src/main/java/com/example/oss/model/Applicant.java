package com.example.oss.model;

import lombok.Getter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Getter
@Table(name = "applicants")
public class Applicant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.REMOVE,
            fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "voting_id", nullable = false)
    private final Voting voting;

    @NotBlank
    @Size(max = 50)
    private final String name;

    @Transient
    private final int votes;

    public Applicant(Voting voting, String name, int votes) {
        this.voting = voting;
        this.name = name;
        this.votes = votes;
    }
}
