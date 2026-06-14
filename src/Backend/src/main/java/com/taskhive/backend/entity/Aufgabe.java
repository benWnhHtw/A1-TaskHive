package com.taskhive.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Setter
@Getter
public class Aufgabe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titel;

    @Column
    private String beschreibung;

    @Column
    private LocalDate faelligkeitsdatum;

    @Column(nullable = false)
    private String status;

    // Many-to-Many Beziehung zu Person
    @ManyToMany
    @JoinTable(
        name = "person_aufgabe",
        joinColumns = @JoinColumn(name = "aufgabe_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private Set<Person> personen;
}
