package com.taskhive.backend.service;

import com.taskhive.backend.dto.PersonDTO;
import com.taskhive.backend.mapper.PersonMapper;
import com.taskhive.backend.repository.PersonRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;


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
}
