package com.taskhive.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class PersonDTO {

    @NotBlank(message = "Enter the right surname")
    String name;

    @NotBlank(message = "Enter the right name")
    String vorname;

    @NotNull
    Boolean erreichbarkeit;

    @NotNull
    @Min(value = 0, message = "Enter right age")
    Short age;

    @NotNull
    Long zimmerNr;

    Object aufgabe;
}
