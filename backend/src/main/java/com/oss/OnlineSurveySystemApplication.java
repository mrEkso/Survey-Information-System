package com.oss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class OnlineSurveySystemApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().directory(".").ignoreIfMissing().load();
        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        SpringApplication.run(OnlineSurveySystemApplication.class, args);
    }
}
