package com.taskhive.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.time.LocalDate;
import java.util.Set;

@Value
public class AufgabeDTO {

    Long id;

    @NotBlank(message = "Titel darf nicht leer sein")
    String titel;

    String beschreibung;

    @NotNull(message = "Fälligkeitsdatum ist Pflicht")
    LocalDate faelligkeitsdatum;

    @NotBlank(message = "Status ist Pflicht")
    String status;

    // statt Person-Objekte nur IDs
    Set<Long> personIds;
}
