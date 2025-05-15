package com.example.oss.api.enums;

public enum SurveyType {
    SINGLE_CHOICE, // Traditional single option selection
    MULTIPLE_CHOICE, // Multiple options selection
    RATING_SCALE, // Rating on a numeric scale (e.g., 1-5, 1-10)
    MATRIX, // Grid/matrix questions with row items and column ratings
    RANKING // Drag and drop ranking of options
}