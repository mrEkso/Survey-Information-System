package com.example.oss.api.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SurveyOptionDto {
    private UUID id;
    private String name;
    private int votes;
}
