package com.example.oss.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;

@RestController
public class UrlController {
    @GetMapping("/urlVoting")
    protected ResponseEntity<?> getUrlVoting(@RequestParam(name = "votingId") int votingId) {
        String url = "http://localhost:8080/mainServlet/voting?votingId=" + votingId;

        StringSelection stringSelection = new StringSelection(url);
        Clipboard clpbrd = Toolkit.getDefaultToolkit().getSystemClipboard();
        clpbrd.setContents(stringSelection, null);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/resultUrlVoting")
    protected ResponseEntity<?> getResultUrlVoting(@RequestParam(name = "userId") int userId,
                                                   @RequestParam(name = "votingId") int votingId) {
        String resultUrl = "http://localhost:8080/mainServlet/resultVoting?userId=" + userId + "&votingId=" + votingId;

        StringSelection stringSelection = new StringSelection(resultUrl);
        Clipboard clpbrd = Toolkit.getDefaultToolkit().getSystemClipboard();
        clpbrd.setContents(stringSelection, null);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
