package com.taskhive.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Setter
@Getter
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String vorname;
    @Column
    private Boolean erreichbarkeit;
    @Column
    private Short age;

    @ManyToMany(mappedBy = "personen")
    private Set<Aufgabe> aufgaben = new HashSet<>();;


    @OneToOne
    @JoinColumn(name = "zimmer_id")
    private Zimmer zimmer;

}
