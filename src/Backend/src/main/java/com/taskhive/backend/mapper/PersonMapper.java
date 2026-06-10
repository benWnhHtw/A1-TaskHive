package com.taskhive.backend.mapper;

import com.taskhive.backend.dto.PersonDTO;
import com.taskhive.backend.entity.Person;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    PersonDTO toPersonDto(Person person);

    Person toPerson(PersonDTO personDTO);

    List<PersonDTO> toPeopleDto(List<Person> persons);

    List<Person> toPeople(List<PersonDTO> personDTOs);
}
