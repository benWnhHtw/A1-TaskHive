package com.taskhive.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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


    // TODO als FK
    @Column(nullable = false)
    private Long zimmerNr;

}
