package com.taskhive.backend.dto;

import lombok.Value;

@Value
public class ZimmerDTO {

    Long id;
    Integer zimmerNr;
    Long personId;
    Long wgNr;
}
