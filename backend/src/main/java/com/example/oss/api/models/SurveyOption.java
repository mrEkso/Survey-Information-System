package com.example.oss.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
public class SurveyOption {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(cascade = CascadeType.REMOVE,
            fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @NotBlank
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Transient
    private int votes;

    public SurveyOption(Survey survey, String name, int votes) {
        this.survey = survey;
        this.name = name;
        this.votes = votes;
    }

    public SurveyOption(Survey survey, String name) {
        this.survey = survey;
        this.name = name;
    }
}
