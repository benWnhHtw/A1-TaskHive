package com.taskhive.backend.controller;

import com.taskhive.backend.generated.model.PersonDTO;
import com.taskhive.backend.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    @GetMapping()
    public List<PersonDTO> getAllPerson() {
        return personService.getAllPeople();
    }

    @GetMapping("{id}")
    public PersonDTO getPersonById(@PathVariable Long id) {
        return personService.getById(id);
    }

    @PostMapping
    public ResponseEntity<PersonDTO> savePerson(@RequestBody PersonDTO person) {
        return ResponseEntity.ok(personService.createPerson(person));
    }

    @PostMapping("/{personId}/aufgabe/{aufgabeId}")
    public ResponseEntity<PersonDTO> addAufgabeToPerson(
        @PathVariable Long personId,
        @PathVariable Long aufgabeId
    ) {
        return ResponseEntity.ok(personService.addAufgabeToPerson(personId, aufgabeId));
    }
}
