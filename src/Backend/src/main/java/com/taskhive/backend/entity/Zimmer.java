package com.taskhive.backend.entity;

import jakarta.persistence.*;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getZimmerNr() {
        return zimmerNr;
    }

    public void setZimmerNr(Integer zimmerNr) {
        this.zimmerNr = zimmerNr;
    }

    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public Long getWgNr() {
        return wgNr;
    }

    public void setWgNr(Long wgNr) {
        this.wgNr = wgNr;
    }
}
