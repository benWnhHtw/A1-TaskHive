package com.taskhive.backend.mapper;

import com.taskhive.backend.entity.Aufgabe;
import com.taskhive.backend.entity.Person;
import com.taskhive.backend.generated.model.PersonDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    @Mapping(target = "aufgabeIds", source = "aufgaben", qualifiedByName = "aufgabenToIds")
    @Mapping(target = "zimmerId", source = "zimmer.id")
    PersonDTO toPersonDto(Person person);

    @Mapping(target = "aufgaben", ignore = true)
    @Mapping(target = "zimmer", ignore = true)
    Person toPerson(PersonDTO personDTO);

    List<PersonDTO> toPeopleDto(List<Person> persons);

    List<Person> toPeople(List<PersonDTO> personDTOs);

    @Named("aufgabenToIds")
    default Set<Long> aufgabenToIds(Set<Aufgabe> aufgaben) {
        if (aufgaben == null) {
            return new LinkedHashSet<>();
        }

        return aufgaben.stream()
            .map(Aufgabe::getId)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
