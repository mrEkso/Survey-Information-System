package com.example.oss.api.models;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor
@Setter
@ToString(exclude = { "survey", "surveyOption", "voteValues" })
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

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @ManyToOne()
    @JoinColumn(name = "survey_option_id", nullable = true)
    private SurveyOption surveyOption;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "vote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteValue> voteValues = new ArrayList<>();

    public Vote(User user, Survey survey, SurveyOption surveyOption) {
        this.user = user;
        this.survey = survey;
        this.surveyOption = surveyOption;
    }

    public Vote(User user, Survey survey) {
        this.user = user;
        this.survey = survey;
    }
}