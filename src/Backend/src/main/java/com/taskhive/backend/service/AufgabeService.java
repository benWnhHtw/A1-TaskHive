package com.taskhive.backend.service;

import com.taskhive.backend.entity.Aufgabe;
import com.taskhive.backend.generated.model.AufgabeDTO;
import com.taskhive.backend.mapper.AufgabeMapper;
import com.taskhive.backend.repository.AufgabeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AufgabeService {

    private final AufgabeRepository aufgabeRepository;
    private final AufgabeMapper aufgabeMapper;

    public AufgabeDTO findById(long id) {
        return aufgabeMapper.toAufgabeDTO(aufgabeRepository.findById(id).orElse(null));
    }


    public List<AufgabeDTO> findAll() {
        return aufgabeMapper.toListAufgabeDTO(aufgabeRepository.findAll());
    }

    public AufgabeDTO createAufgabe(AufgabeDTO aufgabeDTO){
        return aufgabeMapper.toAufgabeDTO(aufgabeRepository.save(aufgabeMapper.toAufgabe(aufgabeDTO)));
    }
}
