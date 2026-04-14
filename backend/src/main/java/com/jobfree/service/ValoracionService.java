package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.exception.valoracion.ValoracionInvalidaException;
import com.jobfree.exception.valoracion.ValoracionNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Valoracion;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.ProfesionalInfoRepository;
import com.jobfree.repository.ValoracionRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ValoracionService {

    private final ValoracionRepository valoracionRepository;
    private final ProfesionalInfoRepository profesionalInfoRepository;

    public ValoracionService(ValoracionRepository valoracionRepository,
                            ProfesionalInfoRepository profesionalInfoRepository) {
        this.valoracionRepository = valoracionRepository;
        this.profesionalInfoRepository = profesionalInfoRepository;
    }

    /**
     * Obtiene todas las valoraciones registradas en el sistema.
     *
     * @return lista de valoraciones
     */
    public List<Valoracion> listarValoraciones() {
        return valoracionRepository.findAll();
    }

    /**
     * Obtiene una valoración por su ID.
     *
     * @param id identificador de la valoración
     * @return valoración encontrada
     * @throws ValoracionNotFoundException si no existe la valoración
     */
    public Valoracion obtenerPorId(Long id) {
        return valoracionRepository.findById(id)
                .orElseThrow(() -> new ValoracionNotFoundException(id));
    }

    /**
     * Crea una nueva valoración validando los datos y actualizando
     * la media y el número de valoraciones del profesional.
     *
     * @param valoracion datos de la valoración
     * @return valoración creada
     * @throws ValoracionInvalidaException si los datos no son válidos o ya existe una valoración para la reserva
     */
    public Valoracion crearValoracion(Valoracion valoracion) {

        validarValoracion(valoracion);

        if (valoracionRepository.existsByReservaId(valoracion.getReserva().getId())) {
            throw new ValoracionInvalidaException("Ya existe una valoración para esta reserva");
        }

        Valoracion nueva = valoracionRepository.save(valoracion);

        Long profesionalId = nueva.getProfesional().getId();

        double media = obtenerMediaProfesional(profesionalId);
        long total = contarValoracionesProfesional(profesionalId);

        ProfesionalInfo profesional = profesionalInfoRepository.findById(profesionalId)
                .orElseThrow(() -> new ValoracionInvalidaException("Profesional no encontrado"));

        profesional.setValoracionMedia(media);
        profesional.setNumeroValoraciones((int) total);

        return nueva;
    }

    /**
     * Elimina una valoración existente y recalcula los datos del profesional.
     *
     * @param id identificador de la valoración
     * @throws ValoracionNotFoundException si no existe la valoración
     */
    public void eliminarValoracion(Long id) {

        Valoracion valoracion = obtenerPorId(id);
        Long profesionalId = valoracion.getProfesional().getId();

        valoracionRepository.delete(valoracion);

        double media = obtenerMediaProfesional(profesionalId);
        long total = contarValoracionesProfesional(profesionalId);

        ProfesionalInfo profesional = profesionalInfoRepository.findById(profesionalId)
                .orElseThrow(() -> new ValoracionInvalidaException("Profesional no encontrado"));

        profesional.setValoracionMedia(media);
        profesional.setNumeroValoraciones((int) total);
    }

    /**
     * Obtiene la media de valoraciones de un profesional.
     *
     * @param profesionalId identificador del profesional
     * @return media de valoraciones (0.0 si no tiene valoraciones)
     */
    public double obtenerMediaProfesional(Long profesionalId) {

        Double media = valoracionRepository.obtenerMediaPorProfesional(profesionalId);

        return (media != null) ? media : 0.0;
    }

    /**
     * Obtiene el número total de valoraciones de un profesional.
     *
     * @param profesionalId identificador del profesional
     * @return número total de valoraciones
     */
    public long contarValoracionesProfesional(Long profesionalId) {

        Long total = valoracionRepository.contarPorProfesional(profesionalId);

        return (total != null) ? total : 0L;
    }

    /**
     * Valida los datos básicos de una valoración.
     *
     * @param valoracion valoración a validar
     * @throws ValoracionInvalidaException si los datos no son válidos
     */
    private void validarValoracion(Valoracion valoracion) {

        if (valoracion.getEstrellas() == null) {
            throw new ValoracionInvalidaException("Las estrellas son obligatorias");
        }

        if (valoracion.getEstrellas() < 1 || valoracion.getEstrellas() > 5) {
            throw new ValoracionInvalidaException("La puntuación debe estar entre 1 y 5");
        }

        if (valoracion.getReserva() == null) {
            throw new ValoracionInvalidaException("La reserva es obligatoria");
        }

        if (valoracion.getCliente() == null) {
            throw new ValoracionInvalidaException("El cliente es obligatorio");
        }

        if (valoracion.getProfesional() == null) {
            throw new ValoracionInvalidaException("El profesional es obligatorio");
        }

        if (valoracion.getReserva().getEstado() != EstadoReserva.COMPLETADA) {
            throw new ValoracionInvalidaException("Solo se pueden valorar reservas completadas");
        }

        if (!valoracion.getReserva().getCliente().getId()
                .equals(valoracion.getCliente().getId())) {
            throw new ValoracionInvalidaException("El cliente no corresponde con la reserva");
        }

        if (!valoracion.getReserva().getServicio().getProfesional().getId()
                .equals(valoracion.getProfesional().getId())) {
            throw new ValoracionInvalidaException("El profesional no corresponde con la reserva");
        }
    }
}
