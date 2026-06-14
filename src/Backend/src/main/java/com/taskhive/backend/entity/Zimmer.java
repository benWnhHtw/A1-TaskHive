package com.taskhive.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "zimmer")
public class Zimmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zimmer_nr")
    private Integer zimmerNr;

    @Column(name = "person_id")
    private Long personId;

    @Column(name = "wg_nr")
    private Long wgNr;
}
