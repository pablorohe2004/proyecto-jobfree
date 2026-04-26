package com.jobfree.config;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ConversacionService;

@Component
public class ChatSubscriptionInterceptor implements ChannelInterceptor {

	private final ConversacionService conversacionService;

	public ChatSubscriptionInterceptor(ConversacionService conversacionService) {
		this.conversacionService = conversacionService;
	}

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		if (accessor == null || accessor.getCommand() != StompCommand.SUBSCRIBE) {
			return message;
		}

		String destino = accessor.getDestination();
		Principal principal = accessor.getUser();

		if (destino == null || principal == null || !destino.startsWith("/topic/conversaciones/")) {
			return message;
		}

		if (!(principal instanceof Usuario usuario)) {
			throw new IllegalArgumentException("Usuario no autenticado para la suscripción");
		}

		Long conversacionId = extraerConversacionId(destino);
		conversacionService.obtenerPorIdSeguro(conversacionId, usuario);

		return message;
	}

	private Long extraerConversacionId(String destino) {
		String valor = destino.substring("/topic/conversaciones/".length());
		return Long.parseLong(valor);
	}
}
