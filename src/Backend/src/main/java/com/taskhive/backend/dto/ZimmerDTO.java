package com.taskhive.backend.dto;

public class ZimmerDTO {

    private Long id;
    private Integer zimmerNr;
    private Long personId;
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
