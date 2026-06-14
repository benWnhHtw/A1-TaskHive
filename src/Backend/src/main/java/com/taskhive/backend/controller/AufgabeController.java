package com.taskhive.backend.controller;

import com.taskhive.backend.generated.model.AufgabeDTO;
import com.taskhive.backend.generated.model.PersonDTO;
import com.taskhive.backend.mapper.AufgabeMapper;
import com.taskhive.backend.service.AufgabeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aufgabe")
@RequiredArgsConstructor
public class AufgabeController {

    private final AufgabeService aufgabeService;

    @GetMapping
    public List<AufgabeDTO> getAufgaben() {
        return aufgabeService.findAll();
    }

    @GetMapping("{id}")
    public AufgabeDTO getAufgaben(@PathVariable long id) {
        return aufgabeService.findById(id);
    }


    @PostMapping
    public ResponseEntity<AufgabeDTO> createAufgabe(@RequestBody AufgabeDTO aufgabe) {
        return ResponseEntity.ok(aufgabeService.createAufgabe(aufgabe));
    }
}
