package com.jobfree.service;

import java.math.BigDecimal;
import java.util.List;

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

	private final PagoRepository      pagoRepository;
	private final NotificacionService notificacionService;

	public PagoService(PagoRepository pagoRepository, NotificacionService notificacionService) {
		this.pagoRepository      = pagoRepository;
		this.notificacionService = notificacionService;
	}

	/**
	 * Obtiene todos los pagos del sistema.
	 *
	 * @return lista de pagos
	 */
	public List<Pago> listarPagos() {
		return pagoRepository.findAll();
	}

	/**
	 * Busca un pago por su id.
	 *
	 * @param id id del pago
	 * @return pago encontrado
	 * @throws PagoNotFoundException si no existe
	 */
	public Pago obtenerPorId(Long id) {
		return pagoRepository.findById(id).orElseThrow(() -> new PagoNotFoundException(id));
	}

	/**
	 * Crea un nuevo pago en estado PENDIENTE. En un sistema real, esto
	 * representaría la creación de una intención de pago (payment intent).
	 *
	 * @param pago datos del pago
	 * @return pago guardado
	 * @throws PagoInvalidoException si los datos no son válidos
	 */
	public Pago guardarPago(Pago pago) {

		// Validar reserva
		if (pago.getReserva() == null) {
			throw new PagoInvalidoException("La reserva es obligatoria");
		}

		// Validar importe
		if (pago.getImporte() == null || pago.getImporte().compareTo(BigDecimal.ZERO) <= 0) {
			throw new PagoInvalidoException("El importe debe ser mayor que 0");
		}

		// Evitar duplicados
		if (pagoRepository.findByReservaId(pago.getReserva().getId()).isPresent()) {
			throw new PagoInvalidoException("La reserva ya tiene un pago asociado");
		}

		// Estado inicial (clave en sistema real)
		pago.setEstado(EstadoPago.PENDIENTE);

		return pagoRepository.save(pago);
	}

	/**
	 * Confirma un pago pendiente, pasándolo a estado PAGADO.
	 *
	 * @param id id del pago
	 * @return pago actualizado
	 * @throws PagoNotFoundException  si no existe
	 * @throws PagoInvalidoException  si el pago ya está pagado o reembolsado
	 */
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

		Usuario profesional = guardado.getReserva().getServicio().getProfesional().getUsuario();
		notificacionService.crear(
				"Pago #" + guardado.getId() + " confirmado por " + guardado.getImporte() + " €. " +
				"Reserva #" + guardado.getReserva().getId() + " lista para completar.",
				profesional
		);

		return guardado;
	}

	/**
	 * Actualiza el estado de un pago. Este método está pensado para integraciones
	 * externas (ej: webhooks de Stripe o PayPal).
	 *
	 * @param id     id del pago
	 * @param estado nuevo estado
	 * @return pago actualizado
	 * @throws PagoNotFoundException si no existe
	 */
	public Pago actualizarEstado(Long id, EstadoPago estado) {

		Pago pago = obtenerPorId(id);

		pago.setEstado(estado);

		return pagoRepository.save(pago);
	}

	/**
	 * Obtiene el pago asociado a una reserva si el usuario autenticado tiene acceso
	 * a dicha reserva (cliente o profesional).
	 *
	 * @param reservaId id de la reserva
	 * @param usuario   usuario autenticado
	 * @return pago encontrado
	 * @throws PagoNotFoundException si no existe
	 */
	public Pago obtenerPorReserva(Long reservaId, Usuario usuario) {

		Pago pago = pagoRepository.findByReservaId(reservaId).orElseThrow(() -> new PagoNotFoundException(reservaId));

		Usuario cliente = pago.getReserva().getCliente();
		Usuario profesional = pago.getReserva().getServicio().getProfesional().getUsuario();

		if (!cliente.getId().equals(usuario.getId()) && !profesional.getId().equals(usuario.getId())) {

			throw new IllegalArgumentException("No tienes acceso a este pago");
		}

		return pago;
	}
}
