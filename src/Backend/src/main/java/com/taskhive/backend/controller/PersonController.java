package com.taskhive.backend.controller;

import com.taskhive.backend.dto.PersonDTO;
import com.taskhive.backend.service.PersonService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/person")
@AllArgsConstructor
public class PersonController {

    @Autowired
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
    public ResponseEntity<PersonDTO> savePerson(@RequestBody @Valid PersonDTO person) {
        PersonDTO personDTO = personService.createPerson(person);
        return ResponseEntity.ok(personDTO);
    }

}
