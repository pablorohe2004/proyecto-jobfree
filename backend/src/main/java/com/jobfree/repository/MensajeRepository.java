package com.jobfree.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

}
