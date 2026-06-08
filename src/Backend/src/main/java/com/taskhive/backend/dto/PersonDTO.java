package com.taskhive.backend.dto;

import jakarta.persistence.Column;
import lombok.Value;

@Value
public class PersonDTO {
   Long id;
   String name;
   String vorname;
   Boolean erreichbarkeit;
   Short age;
   Long zimmerNr;
   Object aufgabe;
}
