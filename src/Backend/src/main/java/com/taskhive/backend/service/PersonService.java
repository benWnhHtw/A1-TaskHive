package com.taskhive.backend.service;

import com.taskhive.backend.entity.Aufgabe;
import com.taskhive.backend.entity.Person;
import com.taskhive.backend.generated.model.PersonDTO;
import com.taskhive.backend.mapper.PersonMapper;
import com.taskhive.backend.repository.AufgabeRepository;
import com.taskhive.backend.repository.PersonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;
    private final AufgabeRepository aufgabeRepository;


    public List<PersonDTO> getAllPeople() {
        var persons = personRepository.findAll();
        return personMapper.toPeopleDto(persons);
    }

    public PersonDTO createPerson(PersonDTO person) {
        return personMapper.toPersonDto(personRepository.save(personMapper.toPerson(person)));
    }

    public PersonDTO getById(Long id) {
        return personMapper.toPersonDto(personRepository.findById(id).orElse(null));
    }

    @Transactional
    public PersonDTO addAufgabeToPerson(Long personId, Long aufgabeId) {
        Person person = personRepository.findById(personId)
            .orElseThrow(() -> new RuntimeException("Person nicht gefunden"));

        Aufgabe aufgabe = aufgabeRepository.findById(aufgabeId)
            .orElseThrow(() -> new RuntimeException("Aufgabe nicht gefunden"));

        aufgabe.getPersonen().add(person);
        person.getAufgaben().add(aufgabe);

        aufgabeRepository.save(aufgabe);

        return personMapper.toPersonDto(person);
    }
}
