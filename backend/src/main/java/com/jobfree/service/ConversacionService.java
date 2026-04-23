package com.jobfree.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.ConversacionRepository;
import com.jobfree.repository.ReservaRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ConversacionService {

	private final ConversacionRepository conversacionRepository;
	private final ReservaRepository reservaRepository;
	private final UsuarioRepository usuarioRepository;

	public ConversacionService(ConversacionRepository conversacionRepository, ReservaRepository reservaRepository,
			UsuarioRepository usuarioRepository) {
		this.conversacionRepository = conversacionRepository;
		this.reservaRepository = reservaRepository;
		this.usuarioRepository = usuarioRepository;
	}

	public Conversacion obtenerPorId(Long id) {
		return conversacionRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Conversación no encontrada"));
	}

	public Conversacion obtenerPorIdSeguro(Long id, Usuario usuario) {
		Conversacion conversacion = obtenerPorId(id);
		validarParticipante(conversacion, usuario);
		return conversacion;
	}

	public Conversacion obtenerPorReservaSeguro(Long reservaId, Usuario usuario) {
		Reserva reserva = reservaRepository.findById(reservaId)
				.orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
		Conversacion conversacion = obtenerOCrearPorReserva(reserva);
		validarParticipante(conversacion, usuario);
		return conversacion;
	}

	public List<Conversacion> misConversaciones(Usuario usuario) {
		return conversacionRepository
				.findByClienteIdOrProfesionalIdOrderByFechaCreacionDesc(usuario.getId(), usuario.getId())
				.stream()
				.sorted(Comparator.comparing(this::fechaOrdenacion).reversed())
				.toList();
	}

	public Conversacion obtenerOCrearPorReserva(Reserva reserva) {
		return conversacionRepository.findByReservaId(reserva.getId())
				.orElseGet(() -> vincularReservaAConversacionExistenteOCrear(reserva));
	}

	public Conversacion crearOObtenerConversacion(Long clienteId, Long profesionalId) {
		Usuario cliente = usuarioRepository.findById(clienteId)
				.orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
		Usuario profesional = usuarioRepository.findById(profesionalId)
				.orElseThrow(() -> new IllegalArgumentException("Profesional no encontrado"));

		if (cliente.getRol() != Rol.CLIENTE) {
			throw new IllegalArgumentException("Solo un cliente puede iniciar una conversación");
		}

		if (profesional.getRol() != Rol.PROFESIONAL) {
			throw new IllegalArgumentException("El usuario seleccionado no es un profesional");
		}

		if (cliente.getId().equals(profesional.getId())) {
			throw new IllegalArgumentException("No puedes iniciar una conversación contigo mismo");
		}

		String contactoClave = buildContactoClave(cliente.getId(), profesional.getId());

		return conversacionRepository
				.findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(cliente.getId(), profesional.getId())
				.or(() -> conversacionRepository.findByContactoClave(contactoClave))
				.orElseGet(() -> crearConversacionContacto(cliente, profesional, contactoClave));
	}

	public void validarParticipante(Conversacion conversacion, Usuario usuario) {
		Long usuarioId = usuario.getId();
		boolean esCliente = conversacion.getCliente().getId().equals(usuarioId);
		boolean esProfesional = conversacion.getProfesional().getId().equals(usuarioId);

		if (!esCliente && !esProfesional) {
			throw new IllegalArgumentException("No tienes acceso a esta conversación");
		}
	}

	private java.time.LocalDateTime fechaOrdenacion(Conversacion conversacion) {
		return conversacion.getMensajes().stream()
				.map(m -> m.getFechaEnvio())
				.max(java.time.LocalDateTime::compareTo)
				.orElse(conversacion.getFechaCreacion());
	}

	private Conversacion vincularReservaAConversacionExistenteOCrear(Reserva reserva) {
		Usuario cliente = reserva.getCliente();
		Usuario profesional = reserva.getServicio().getProfesional().getUsuario();
		String contactoClave = buildContactoClave(cliente.getId(), profesional.getId());

		Conversacion conversacionExistente = conversacionRepository.findByContactoClave(contactoClave).orElse(null);
		if (conversacionExistente != null) {
			conversacionExistente.setReserva(reserva);
			conversacionExistente.setContactoClave(null);
			return conversacionRepository.save(conversacionExistente);
		}

		return conversacionRepository.save(new Conversacion(reserva, cliente, profesional));
	}

	private Conversacion crearConversacionContacto(Usuario cliente, Usuario profesional, String contactoClave) {
		try {
			return conversacionRepository.save(new Conversacion(cliente, profesional, contactoClave));
		} catch (DataIntegrityViolationException ex) {
			return conversacionRepository.findByContactoClave(contactoClave).orElseThrow(() -> ex);
		}
	}

	private String buildContactoClave(Long clienteId, Long profesionalId) {
		return clienteId + ":" + profesionalId;
	}
}
