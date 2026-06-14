package com.taskhive.backend.repository;

import com.taskhive.backend.entity.Aufgabe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AufgabeRepository extends JpaRepository<Aufgabe, Long> {
}
