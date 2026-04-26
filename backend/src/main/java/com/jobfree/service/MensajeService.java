package com.jobfree.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.dto.mensaje.MensajeBatchUpdateDTO;
import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.exception.mensaje.MensajeNotFoundException;
import com.jobfree.mapper.ConversacionMapper;
import com.jobfree.mapper.MensajeMapper;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.MensajeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class MensajeService {

	private final MensajeRepository mensajeRepository;
	private final UsuarioService usuarioService;
	private final ConversacionService conversacionService;
	private final ChatRealtimePublisher chatRealtimePublisher;

	public MensajeService(MensajeRepository mensajeRepository, UsuarioService usuarioService,
			ConversacionService conversacionService, ChatRealtimePublisher chatRealtimePublisher) {
		this.mensajeRepository = mensajeRepository;
		this.usuarioService = usuarioService;
		this.conversacionService = conversacionService;
		this.chatRealtimePublisher = chatRealtimePublisher;
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
	 * Obtiene los mensajes de una conversación si el usuario tiene
	 * acceso.
	 *
	 * @param conversacionId id de la conversación
	 * @param usuario   usuario autenticado
	 * @return lista de mensajes ordenados por fecha
	 */
	public List<Mensaje> obtenerPorConversacion(Long conversacionId, Usuario usuario) {

		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(conversacionId, usuario);
		return mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacion.getId());
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
		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(dto.getConversacionId(), remitente);

		// Validar remitente (seguridad real)
		conversacionService.validarParticipante(conversacion, remitente);

		Usuario cliente = conversacion.getCliente();
		Usuario profesional = conversacion.getProfesional();

		// Validar destinatario
		if (!cliente.getId().equals(destinatario.getId()) && !profesional.getId().equals(destinatario.getId())) {

			throw new IllegalArgumentException("El destinatario no pertenece a la conversación");
		}

		Mensaje existente = mensajeRepository.findByConversacionIdAndRemitenteIdAndClientMessageId(
				conversacion.getId(),
				remitente.getId(),
				dto.getClientMessageId()
		).orElse(null);

		if (existente != null) {
			return existente;
		}

		Mensaje mensaje = MensajeMapper.toEntity(dto, remitente, destinatario, conversacion);
		Mensaje guardado = mensajeRepository.save(mensaje);
		MensajeDTO mensajeDTO = MensajeMapper.toDTO(guardado);
		ConversacionDTO conversacionDTO = ConversacionMapper.toDTO(conversacion);

		chatRealtimePublisher.publicarMensajeNuevo(
				conversacion.getId(),
				mensajeDTO,
				destinatario.getEmail()
		);

		chatRealtimePublisher.publicarConversacionActualizada(
				conversacion.getId(),
				conversacionDTO,
				cliente.getEmail(),
				profesional.getEmail()
		);

		return guardado;
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

		if (mensaje.isLeido()) {
			return mensaje;
		}

		boolean cambioRecibido = !mensaje.isRecibido();
		if (cambioRecibido) {
			mensaje.setRecibido(true);
		}
		mensaje.setLeido(true);

		Mensaje guardado = mensajeRepository.save(mensaje);
		Conversacion conversacion = guardado.getConversacion();
		ConversacionDTO conversacionDTO = ConversacionMapper.toDTO(conversacion);

		chatRealtimePublisher.publicarMensajeLeido(
				conversacion.getId(),
				guardado.getId(),
				usuario.getId(),
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		if (cambioRecibido) {
			chatRealtimePublisher.publicarMensajeRecibido(
					conversacion.getId(),
					guardado.getId(),
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);
		}

		chatRealtimePublisher.publicarConversacionActualizada(
				conversacion.getId(),
				conversacionDTO,
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		return guardado;
	}

	public Mensaje marcarComoRecibido(Long id, Usuario usuario) {

		Mensaje mensaje = obtenerPorId(id);

		if (!mensaje.getDestinatario().getId().equals(usuario.getId())) {
			throw new IllegalArgumentException("No puedes marcar este mensaje");
		}

		if (mensaje.isRecibido()) {
			return mensaje;
		}

		mensaje.setRecibido(true);

		Mensaje guardado = mensajeRepository.save(mensaje);
		Conversacion conversacion = guardado.getConversacion();
		ConversacionDTO conversacionDTO = ConversacionMapper.toDTO(conversacion);

		chatRealtimePublisher.publicarMensajeRecibido(
				conversacion.getId(),
				guardado.getId(),
				usuario.getId(),
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		chatRealtimePublisher.publicarConversacionActualizada(
				conversacion.getId(),
				conversacionDTO,
				conversacion.getCliente().getEmail(),
				conversacion.getProfesional().getEmail()
		);

		return guardado;
	}

	public List<Mensaje> marcarComoRecibidoBatch(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Mensaje> mensajes = obtenerMensajesBatchDelDestinatario(dto, usuario);
		List<Mensaje> actualizados = new ArrayList<>();

		for (Mensaje mensaje : mensajes) {
			if (mensaje.isRecibido()) {
				continue;
			}

			mensaje.setRecibido(true);
			actualizados.add(mensaje);
		}

		if (actualizados.isEmpty()) {
			return mensajes;
		}

		List<Mensaje> guardados = mensajeRepository.saveAll(actualizados);
		publicarEventosBatchRecibido(guardados, usuario);
		return mensajes;
	}

	public List<Mensaje> marcarComoLeidoBatch(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Mensaje> mensajes = obtenerMensajesBatchDelDestinatario(dto, usuario);
		List<Mensaje> actualizados = new ArrayList<>();
		List<Mensaje> marcadosComoRecibidos = new ArrayList<>();

		for (Mensaje mensaje : mensajes) {
			if (mensaje.isLeido()) {
				continue;
			}

			if (!mensaje.isRecibido()) {
				mensaje.setRecibido(true);
				marcadosComoRecibidos.add(mensaje);
			}

			mensaje.setLeido(true);
			actualizados.add(mensaje);
		}

		if (actualizados.isEmpty()) {
			return mensajes;
		}

		List<Mensaje> guardados = mensajeRepository.saveAll(actualizados);
		List<Long> idsRecibidos = marcadosComoRecibidos.stream().map(Mensaje::getId).collect(Collectors.toList());
		publicarEventosBatchLeido(guardados, idsRecibidos, usuario);
		return mensajes;
	}

	private List<Mensaje> obtenerMensajesBatchDelDestinatario(MensajeBatchUpdateDTO dto, Usuario usuario) {
		List<Long> ids = dto.getMensajeIds().stream()
				.filter(id -> id != null)
				.collect(Collectors.collectingAndThen(Collectors.toCollection(LinkedHashSet::new), ArrayList::new));

		if (ids.isEmpty()) {
			return List.of();
		}

		return mensajeRepository.findByIdInAndDestinatarioId(ids, usuario.getId());
	}

	private void publicarEventosBatchRecibido(List<Mensaje> mensajes, Usuario usuario) {
		Map<Long, List<Mensaje>> porConversacion = mensajes.stream()
				.collect(Collectors.groupingBy(mensaje -> mensaje.getConversacion().getId()));

		for (List<Mensaje> mensajesConversacion : porConversacion.values()) {
			Conversacion conversacion = mensajesConversacion.get(0).getConversacion();
			ConversacionDTO conversacionDTO = ConversacionMapper.toDTO(conversacion);

			chatRealtimePublisher.publicarMensajeRecibidoLoteDesdeMensajes(
					conversacion.getId(),
					mensajesConversacion,
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);

			chatRealtimePublisher.publicarConversacionActualizada(
					conversacion.getId(),
					conversacionDTO,
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);
		}
	}

	private void publicarEventosBatchLeido(List<Mensaje> mensajes, List<Long> idsRecibidos, Usuario usuario) {
		Map<Long, List<Mensaje>> porConversacion = mensajes.stream()
				.collect(Collectors.groupingBy(mensaje -> mensaje.getConversacion().getId()));
		LinkedHashSet<Long> idsRecibidosSet = new LinkedHashSet<>(idsRecibidos);

		for (List<Mensaje> mensajesConversacion : porConversacion.values()) {
			Conversacion conversacion = mensajesConversacion.get(0).getConversacion();
			ConversacionDTO conversacionDTO = ConversacionMapper.toDTO(conversacion);

			if (mensajesConversacion.stream().anyMatch(mensaje -> idsRecibidosSet.contains(mensaje.getId()))) {
				List<Mensaje> mensajesRecibidos = mensajesConversacion.stream()
						.filter(mensaje -> idsRecibidosSet.contains(mensaje.getId()))
						.collect(Collectors.toList());

				chatRealtimePublisher.publicarMensajeRecibidoLoteDesdeMensajes(
						conversacion.getId(),
						mensajesRecibidos,
						usuario.getId(),
						conversacion.getCliente().getEmail(),
						conversacion.getProfesional().getEmail()
				);
			}

			chatRealtimePublisher.publicarMensajeLeidoLoteDesdeMensajes(
					conversacion.getId(),
					mensajesConversacion,
					usuario.getId(),
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);

			chatRealtimePublisher.publicarConversacionActualizada(
					conversacion.getId(),
					conversacionDTO,
					conversacion.getCliente().getEmail(),
					conversacion.getProfesional().getEmail()
			);
		}
	}
}
