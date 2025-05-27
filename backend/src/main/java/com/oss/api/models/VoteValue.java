package com.oss.api.models;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vote_values")
public class VoteValue {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "vote_id", nullable = false)
    @JsonBackReference
    private Vote vote;

    @ManyToOne
    @JoinColumn(name = "survey_option_id", nullable = false)
    @JsonBackReference
    private SurveyOption surveyOption;

    @Column(name = "numeric_value", nullable = true)
    private Integer numericValue;

    @Column(name = "rank_position", nullable = true)
    private Integer rankPosition;

    public VoteValue(Vote vote, SurveyOption surveyOption, Integer numericValue, Integer rankPosition) {
        this.vote = vote;
        this.surveyOption = surveyOption;
        this.numericValue = numericValue;
        this.rankPosition = rankPosition;
    }
}