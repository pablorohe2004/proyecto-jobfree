package com.jobfree.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobfree.model.entity.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

}
