package com.taskhive.backend.mapper;

import com.taskhive.backend.entity.Aufgabe;
import com.taskhive.backend.entity.Person;
import com.taskhive.backend.generated.model.AufgabeDTO;
import com.taskhive.backend.generated.model.PersonDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AufgabeMapper {

    @Mapping(target = "personIds", source = "personen", qualifiedByName = "personenToIds")
    AufgabeDTO toAufgabeDTO(Aufgabe aufgabe);

    @Mapping(target = "personen", ignore = true)
    Aufgabe toAufgabe(AufgabeDTO aufgabeDTO);

    List<AufgabeDTO> toListAufgabeDTO(List<Aufgabe> aufgaben);

    @Named("personenToIds")
    default Set<Long> personenToIds(Set<Person> personen) {
        if (personen == null) {
            return new LinkedHashSet<>();
        }

        return personen.stream()
            .map(Person::getId)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

}
