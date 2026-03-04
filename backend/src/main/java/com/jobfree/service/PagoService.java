package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Pago;
import com.jobfree.repository.PagoRepository;

@Service
public class PagoService {
	private final PagoRepository pagoRepository;

	public PagoService(PagoRepository pagoRepository) {
		this.pagoRepository = pagoRepository;
	}

	/**
	 * Obtiene la lista completa de pagos guardados en la base de datos.
	 *
	 * @return Lista de pagos.
	 */
	public List<Pago> listarPagos() {
		return pagoRepository.findAll();
	}

	/**
	 * Guarda un nuevo pago en la base de datos.
	 *
	 * @param pago Pago que se quiere registrar.
	 * @return Pago guardado correctamente.
	 */
	public Pago guardarPago(Pago pago) {
		return pagoRepository.save(pago);
	}
}
