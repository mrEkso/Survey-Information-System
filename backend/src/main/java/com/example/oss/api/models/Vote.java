package com.example.oss.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "user_id",
                "survey_id"
        })
})
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @NotNull
    @ManyToOne()
    @JoinColumn(name = "applicant_id", nullable = false)
    private SurveyOption applicant;

    public Vote(User user, Survey survey, SurveyOption applicant) {
        this.user = user;
        this.survey = survey;
        this.applicant = applicant;
    }

    public Vote(User user, Survey survey) {
        this.user = user;
        this.survey = survey;
    }
}
