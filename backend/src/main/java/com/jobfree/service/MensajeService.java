package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.exception.mensaje.MensajeNotFoundException;
import com.jobfree.mapper.MensajeMapper;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.MensajeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class MensajeService {

	private final MensajeRepository mensajeRepository;
	private final UsuarioService usuarioService;
	private final ReservaService reservaService;

	public MensajeService(MensajeRepository mensajeRepository, UsuarioService usuarioService,
			ReservaService reservaService) {
		this.mensajeRepository = mensajeRepository;
		this.usuarioService = usuarioService;
		this.reservaService = reservaService;
	}

	/**
	 * Obtiene todos los mensajes del sistema (uso administrativo).
	 *
	 * @return lista de mensajes
	 */
	public List<Mensaje> listarMensajes() {
		return mensajeRepository.findAll();
	}

	/**
	 * Busca un mensaje por su ID.
	 *
	 * @param id identificador del mensaje
	 * @return mensaje encontrado
	 * @throws MensajeNotFoundException si no existe
	 */
	public Mensaje obtenerPorId(Long id) {
		return mensajeRepository.findById(id).orElseThrow(() -> new MensajeNotFoundException(id));
	}

	/**
	 * Obtiene los mensajes de una conversación (reserva) si el usuario tiene
	 * acceso.
	 *
	 * @param reservaId id de la reserva
	 * @param usuario   usuario autenticado
	 * @return lista de mensajes ordenados por fecha
	 */
	public List<Mensaje> obtenerPorReserva(Long reservaId, Usuario usuario) {

		Reserva reserva = reservaService.obtenerPorId(reservaId);

		Usuario cliente = reserva.getCliente();
		Usuario profesional = reserva.getServicio().getProfesional().getUsuario();

		if (!cliente.getId().equals(usuario.getId()) && !profesional.getId().equals(usuario.getId())) {

			throw new IllegalArgumentException("No tienes acceso a esta conversación");
		}

		return mensajeRepository.findByReservaIdOrderByFechaEnvioAsc(reservaId);
	}

	/**
	 * Crea un mensaje dentro de una conversación. El remitente se obtiene del
	 * usuario autenticado.
	 *
	 * @param dto       datos del mensaje
	 * @param remitente usuario autenticado
	 * @return mensaje creado
	 */
	public Mensaje crear(MensajeCreateDTO dto, Usuario remitente) {

		Usuario destinatario = usuarioService.obtenerPorId(dto.getDestinatarioId());
		Reserva reserva = reservaService.obtenerPorId(dto.getReservaId());

		Usuario cliente = reserva.getCliente();
		Usuario profesional = reserva.getServicio().getProfesional().getUsuario();

		// Validar remitente (seguridad real)
		if (!cliente.getId().equals(remitente.getId()) && !profesional.getId().equals(remitente.getId())) {

			throw new IllegalArgumentException("El remitente no pertenece a la reserva");
		}

		// Validar destinatario
		if (!cliente.getId().equals(destinatario.getId()) && !profesional.getId().equals(destinatario.getId())) {

			throw new IllegalArgumentException("El destinatario no pertenece a la reserva");
		}

		Mensaje mensaje = MensajeMapper.toEntity(dto, remitente, destinatario, reserva);

		return mensajeRepository.save(mensaje);
	}

	/**
	 * Marca un mensaje como leído. Solo el destinatario puede hacerlo.
	 *
	 * @param id      id del mensaje
	 * @param usuario usuario autenticado
	 * @return mensaje actualizado
	 */
	public Mensaje marcarComoLeido(Long id, Usuario usuario) {

		Mensaje mensaje = obtenerPorId(id);

		// Seguridad clave
		if (!mensaje.getDestinatario().getId().equals(usuario.getId())) {
			throw new IllegalArgumentException("No puedes marcar este mensaje");
		}

		mensaje.setLeido(true);

		return mensajeRepository.save(mensaje);
	}
}
