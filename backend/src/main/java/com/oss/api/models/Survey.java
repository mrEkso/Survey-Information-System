package com.oss.api.models;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oss.api.enums.SurveyType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString(exclude = { "options", "messages" })
@NoArgsConstructor
@DynamicUpdate
@Table(name = "surveys")
@jakarta.persistence.Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String subtitle;

    @CreationTimestamp
    private Instant createdAt;

    private boolean open;

    @Column(name = "expiration_date")
    private Instant expirationDate;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SurveyOption> options = new ArrayList<>();

    @Column(name = "views", nullable = false, columnDefinition = "int default 0")
    private int views = 0;

    @Version
    @Column(name = "version", nullable = false, columnDefinition = "bigint default 0")
    private Long version = 0L;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Message> messages = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "survey_type", nullable = false, columnDefinition = "varchar(20) default 'SINGLE_CHOICE'")
    private SurveyType surveyType = SurveyType.SINGLE_CHOICE;

    @Min(1)
    @Column(name = "min_rating", nullable = true)
    private Integer minRating;

    @Max(10)
    @Column(name = "max_rating", nullable = true)
    private Integer maxRating;

    @Column(name = "matrix_columns", length = 1000, nullable = true)
    private String matrixColumns;

    @Column(name = "votes_count", nullable = false, columnDefinition = "int default 0")
    private int votesCount = 0;
}
