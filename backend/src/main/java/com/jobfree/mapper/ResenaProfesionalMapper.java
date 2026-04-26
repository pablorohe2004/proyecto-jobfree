package com.jobfree.mapper;

import com.jobfree.dto.resena.ResenaProfesionalCreateDTO;
import com.jobfree.dto.resena.ResenaProfesionalDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ResenaProfesional;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;

public class ResenaProfesionalMapper {

    private ResenaProfesionalMapper() {}

    public static ResenaProfesionalDTO toDTO(ResenaProfesional resena) {
        String clienteNombre = resena.getCliente().getNombre() + " " + resena.getCliente().getApellidos();
        return new ResenaProfesionalDTO(
                resena.getId(),
                resena.getCalificacion(),
                resena.getComentario(),
                resena.getFechaCreacion(),
                clienteNombre,
                resena.getCliente().getId()
        );
    }

    public static ResenaProfesional toEntity(ResenaProfesionalCreateDTO dto,
                                             Usuario cliente,
                                             ProfesionalInfo profesional,
                                             Reserva reserva) {
        return new ResenaProfesional(
                dto.getCalificacion(),
                dto.getComentario(),
                cliente,
                profesional,
                reserva
        );
    }

    public static ResenaProfesional toEntity(ResenaProfesionalCreateDTO dto,
                                             Usuario cliente,
                                             ProfesionalInfo profesional) {
        return new ResenaProfesional(
                dto.getCalificacion(),
                dto.getComentario(),
                cliente,
                profesional
        );
    }
}
