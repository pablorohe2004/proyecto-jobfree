package com.jobfree.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.pago.PagoNotFoundException;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.EstadoPago;
import com.jobfree.repository.PagoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PagoService {

	private static final Logger log = LoggerFactory.getLogger(PagoService.class);

	// Transiciones válidas: desde estado actual → estados permitidos
	private static final java.util.Map<EstadoPago, Set<EstadoPago>> TRANSICIONES_VALIDAS = java.util.Map.of(
			EstadoPago.PENDIENTE,    Set.of(EstadoPago.PAGADO),
			EstadoPago.PAGADO,       Set.of(EstadoPago.REEMBOLSADO),
			EstadoPago.REEMBOLSADO,  Set.of()
	);

	private final PagoRepository      pagoRepository;
	private final NotificacionService notificacionService;

	public PagoService(PagoRepository pagoRepository, NotificacionService notificacionService) {
		this.pagoRepository      = pagoRepository;
		this.notificacionService = notificacionService;
	}

	public List<Pago> listarPagos() {
		return pagoRepository.findAll();
	}

	public Pago obtenerPorId(Long id) {
		return pagoRepository.findById(id).orElseThrow(() -> new PagoNotFoundException(id));
	}

	public Pago guardarPago(Pago pago) {
		if (pago.getReserva() == null) {
			throw new PagoInvalidoException("La reserva es obligatoria");
		}
		if (pago.getImporte() == null || pago.getImporte().compareTo(BigDecimal.ZERO) <= 0) {
			throw new PagoInvalidoException("El importe debe ser mayor que 0");
		}
		if (pagoRepository.findByReservaId(pago.getReserva().getId()).isPresent()) {
			throw new PagoInvalidoException("La reserva ya tiene un pago asociado");
		}

		pago.setEstado(EstadoPago.PENDIENTE);
		Pago guardado = pagoRepository.save(pago);
		log.info("Pago {} creado para reserva {} — importe: {} €",
				guardado.getId(), pago.getReserva().getId(), guardado.getImporte());
		return guardado;
	}

	public Pago confirmarPago(Long id) {
		Pago pago = obtenerPorId(id);

		if (pago.getEstado() == EstadoPago.PAGADO) {
			throw new PagoInvalidoException("El pago ya ha sido confirmado");
		}
		if (pago.getEstado() == EstadoPago.REEMBOLSADO) {
			throw new PagoInvalidoException("No se puede confirmar un pago reembolsado");
		}

		pago.setEstado(EstadoPago.PAGADO);
		Pago guardado = pagoRepository.save(pago);
		log.info("Pago {} confirmado — reserva {}", guardado.getId(), guardado.getReserva().getId());

		Usuario profesional = guardado.getReserva().getServicio().getProfesional().getUsuario();
		notificacionService.crear(
				"Pago #" + guardado.getId() + " confirmado por " + guardado.getImporte() + " €. " +
				"Reserva #" + guardado.getReserva().getId() + " lista para completar.",
				profesional
		);

		return guardado;
	}

	/**
	 * Actualiza el estado de un pago respetando las transiciones válidas.
	 * Solo permite: PENDIENTE → PAGADO → REEMBOLSADO.
	 * Usado principalmente por webhooks de Stripe.
	 */
	public Pago actualizarEstado(Long id, EstadoPago nuevoEstado) {
		Pago pago = obtenerPorId(id);
		EstadoPago estadoActual = pago.getEstado();

		Set<EstadoPago> permitidos = TRANSICIONES_VALIDAS.getOrDefault(estadoActual, Set.of());
		if (!permitidos.contains(nuevoEstado)) {
			throw new PagoInvalidoException(
					"Transición inválida: " + estadoActual + " → " + nuevoEstado +
					". Permitidas desde " + estadoActual + ": " + permitidos);
		}

		pago.setEstado(nuevoEstado);
		Pago guardado = pagoRepository.save(pago);
		log.info("Pago {} cambiado de {} a {}", id, estadoActual, nuevoEstado);
		return guardado;
	}

	public Pago obtenerPorReserva(Long reservaId, Usuario usuario) {
		Pago pago = pagoRepository.findByReservaId(reservaId)
				.orElseThrow(() -> new PagoNotFoundException(reservaId));

		Usuario cliente     = pago.getReserva().getCliente();
		Usuario profesional = pago.getReserva().getServicio().getProfesional().getUsuario();

		if (!cliente.getId().equals(usuario.getId()) && !profesional.getId().equals(usuario.getId())) {
			log.warn("Usuario {} intentó acceder al pago de reserva {} sin permisos", usuario.getId(), reservaId);
			throw new IllegalArgumentException("No tienes acceso a este pago");
		}

		return pago;
	}
}
