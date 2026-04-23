package com.jobfree.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.reserva.ReservaInvalidaException;
import com.jobfree.exception.reserva.ReservaNotFoundException;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.EstadoReserva;
import com.jobfree.repository.PagoRepository;
import com.jobfree.repository.ReservaRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReservaService {

	private final ReservaRepository   reservaRepository;
	private final PagoRepository      pagoRepository;
	private final NotificacionService notificacionService;

	public ReservaService(ReservaRepository reservaRepository,
	                      PagoRepository pagoRepository,
	                      NotificacionService notificacionService) {
		this.reservaRepository   = reservaRepository;
		this.pagoRepository      = pagoRepository;
		this.notificacionService = notificacionService;
	}

	/**
	 * Obtiene todas las reservas registradas en el sistema.
	 *
	 * @return lista de reservas
	 */
	public List<Reserva> listarReservas() {
		return reservaRepository.findAll();
	}

	/**
	 * Busca una reserva por su ID.
	 *
	 * @param id identificador de la reserva
	 * @return reserva encontrada
	 * @throws ReservaNotFoundException si no existe la reserva
	 */
	public Reserva obtenerPorId(Long id) {
		return reservaRepository.findById(id)
				.orElseThrow(() -> new ReservaNotFoundException(id));
	}

	/**
	 * Obtiene una reserva por ID validando que el usuario tenga acceso.
	 *
	 * @param id      identificador de la reserva
	 * @param usuario usuario autenticado
	 * @return reserva si el usuario es cliente o profesional
	 * @throws ReservaInvalidaException si no tiene acceso
	 */
	public Reserva obtenerPorIdSeguro(Long id, Usuario usuario) {

		Reserva reserva = obtenerPorId(id);

		Long clienteId = reserva.getCliente().getId();
		Long profesionalId = reserva.getServicio().getProfesional().getUsuario().getId();

		if (!usuario.getId().equals(clienteId) && !usuario.getId().equals(profesionalId)) {
			throw new ReservaInvalidaException("No tienes acceso a esta reserva");
		}

		return reserva;
	}

	/**
	 * Crea una nueva reserva validando datos y calculando el precio.
	 *
	 * @param reserva datos de la reserva
	 * @return reserva creada y guardada
	 * @throws ReservaInvalidaException si los datos no son válidos
	 */
	public Reserva crearReserva(Reserva reserva) {

		validarReserva(reserva);

		ServicioOfrecido servicio = reserva.getServicio();

		validarServicio(servicio);
		validarFecha(reserva);

		if (reservaRepository.existsByServicioAndFechaInicio(
				reserva.getServicio(), reserva.getFechaInicio())) {

			throw new ReservaInvalidaException("Ya existe una reserva para este servicio en esa fecha");
		}

		reserva.setEstado(EstadoReserva.PENDIENTE);

		BigDecimal horas = BigDecimal.valueOf(servicio.getDuracionMin())
				.divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

		if (horas.compareTo(BigDecimal.ONE) < 0) {
			horas = BigDecimal.ONE;
		}

		BigDecimal precioTotal = servicio.getPrecioHora()
				.multiply(horas)
				.setScale(2, RoundingMode.HALF_UP);

		reserva.setPrecioTotal(precioTotal);

		Reserva nueva = reservaRepository.save(reserva);

		Usuario profesional = nueva.getServicio().getProfesional().getUsuario();
		notificacionService.crear(
				"Nueva solicitud para tu servicio: " + nueva.getServicio().getTitulo() +
				". Revisa tus solicitudes para aceptarla o denegarla.",
				profesional);

		return nueva;
	}

	/**
	 * Confirma una reserva (solo si está pendiente).
	 *
	 * @param reserva reserva a confirmar
	 * @return reserva actualizada
	 * @throws ReservaInvalidaException si el estado no es válido
	 */
	public Reserva confirmarReserva(Reserva reserva) {

		if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
			throw new ReservaInvalidaException("Solo se pueden confirmar reservas pendientes");
		}

		reserva.setEstado(EstadoReserva.CONFIRMADA);
		Reserva guardada = reservaRepository.save(reserva);

		Usuario cliente = guardada.getCliente();
		notificacionService.crear(
				"Tu solicitud #" + guardada.getId() + " ha sido aceptada. " +
				"Servicio: " + guardada.getServicio().getTitulo(),
				cliente);

		return guardada;
	}

	/**
	 * Cancela una reserva.
	 *
	 * @param reserva reserva a cancelar
	 * @return reserva actualizada
	 * @throws ReservaInvalidaException si no se puede cancelar
	 */
	public Reserva cancelarReserva(Reserva reserva) {

		if (reserva.getEstado() == EstadoReserva.COMPLETADA) {
			throw new ReservaInvalidaException("No se puede cancelar una reserva completada");
		}

		if (reserva.getEstado() == EstadoReserva.CANCELADA) {
			throw new ReservaInvalidaException("La reserva ya está cancelada");
		}

		reserva.setEstado(EstadoReserva.CANCELADA);
		return reservaRepository.save(reserva);
	}

	/**
	 * Marca una reserva como completada.
	 * Requiere que la reserva esté CONFIRMADA y que su pago esté en estado PAGADO.
	 *
	 * @param reserva reserva a completar
	 * @return reserva actualizada
	 * @throws ReservaInvalidaException si el estado no es válido
	 * @throws PagoInvalidoException    si el pago no existe o no está confirmado
	 */
	public Reserva completarReserva(Reserva reserva) {

		if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
			throw new ReservaInvalidaException("Solo se pueden completar reservas confirmadas");
		}

		Pago pago = pagoRepository.findByReservaId(reserva.getId())
				.orElseThrow(() -> new PagoInvalidoException("La reserva no tiene un pago asociado"));

		if (pago.getEstado() != EstadoPago.PAGADO) {
			throw new PagoInvalidoException("El pago de la reserva debe estar confirmado antes de completarla");
		}

		reserva.setEstado(EstadoReserva.COMPLETADA);
		Reserva guardada = reservaRepository.save(reserva);

		Usuario cliente = guardada.getCliente();
		notificacionService.crear(
				"Tu reserva #" + guardada.getId() + " ha sido completada. " +
				"Puedes dejar una valoración al profesional.",
				cliente
		);

		return guardada;
	}

	/**
	 * Valida los datos básicos de una reserva.
	 *
	 * @param reserva reserva a validar
	 * @throws ReservaInvalidaException si faltan datos obligatorios
	 */
	private void validarReserva(Reserva reserva) {

		if (reserva.getCliente() == null) {
			throw new ReservaInvalidaException("El cliente es obligatorio");
		}

		if (reserva.getServicio() == null) {
			throw new ReservaInvalidaException("El servicio es obligatorio");
		}
	}

	/**
	 * Valida que el servicio sea correcto y esté disponible.
	 *
	 * @param servicio servicio a validar
	 * @throws ReservaInvalidaException si no es válido
	 */
	private void validarServicio(ServicioOfrecido servicio) {

		if (servicio == null) {
			throw new ReservaInvalidaException("El servicio es obligatorio");
		}

		if (!servicio.isActiva()) {
			throw new ReservaInvalidaException("El servicio no está disponible");
		}

		if (servicio.getDuracionMin() == null || servicio.getDuracionMin() <= 0) {
			throw new ReservaInvalidaException("Duración del servicio no válida");
		}

		if (servicio.getPrecioHora() == null || servicio.getPrecioHora().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ReservaInvalidaException("Precio del servicio no válido");
		}
	}

	/**
	 * Valida la fecha de la reserva.
	 *
	 * @param reserva reserva a validar
	 * @throws ReservaInvalidaException si la fecha es inválida
	 */
	private void validarFecha(Reserva reserva) {

		LocalDateTime ahora = LocalDateTime.now();

		if (reserva.getFechaInicio() == null) {
			reserva.setFechaInicio(ahora);
		} else if (reserva.getFechaInicio().isBefore(ahora)) {
			throw new ReservaInvalidaException("La fecha no puede ser pasada");
		}
	}

	/**
	 * Devuelve todas las reservas en las que el usuario es el cliente.
	 */
	public List<Reserva> listarPorCliente(Long clienteId) {
		return reservaRepository.findByClienteId(clienteId);
	}

	/**
	 * Devuelve todas las reservas de los servicios del profesional autenticado.
	 */
	public List<Reserva> listarPorProfesional(Long usuarioId) {
		return reservaRepository.findByServicio_Profesional_UsuarioId(usuarioId);
	}

	/**
	 * Elimina una reserva.
	 *
	 * @param reserva reserva a eliminar
	 */
	public void eliminarReserva(Reserva reserva) {
		reservaRepository.delete(reserva);
	}
}
