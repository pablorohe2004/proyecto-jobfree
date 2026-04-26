package com.jobfree.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;

import com.jobfree.config.ChatSubscriptionInterceptor;
import com.jobfree.model.entity.Usuario;

@ExtendWith(MockitoExtension.class)
class ChatSubscriptionInterceptorTest {

    @Mock ConversacionService conversacionService;
    @Mock MessageChannel channel;

    @InjectMocks ChatSubscriptionInterceptor interceptor;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        try {
            var field = Usuario.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(usuario, 1L);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void suscripcionConversacion_usuarioAutorizado_pasaSinExcepcion() {
        Message<?> msg = buildSubscribeMessage("/topic/conversaciones/42", usuario);

        assertThatCode(() -> interceptor.preSend(msg, channel)).doesNotThrowAnyException();
        verify(conversacionService).obtenerPorIdSeguro(42L, usuario);
    }

    @Test
    void suscripcionCanal_sinAutenticar_lanzaSecurityException() {
        Message<?> msg = buildSubscribeMessage("/topic/conversaciones/42", null);

        assertThatThrownBy(() -> interceptor.preSend(msg, channel))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("autenticación");
    }

    @Test
    void suscripcionCanalUsuarioPropio_autorizado_pasaSinExcepcion() {
        Message<?> msg = buildSubscribeMessage("/topic/usuario/1", usuario);

        assertThatCode(() -> interceptor.preSend(msg, channel)).doesNotThrowAnyException();
    }

    @Test
    void suscripcionCanalUsuarioAjeno_lanzaSecurityException() {
        Message<?> msg = buildSubscribeMessage("/topic/usuario/999", usuario);

        assertThatThrownBy(() -> interceptor.preSend(msg, channel))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("otro usuario");
    }

    @Test
    void suscripcionConIdInvalido_lanzaIllegalArgumentException() {
        Message<?> msg = buildSubscribeMessage("/topic/conversaciones/abc", usuario);

        assertThatThrownBy(() -> interceptor.preSend(msg, channel))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("inválido");
    }

    @Test
    void mensajeNoSuscripcion_pasaSinValidar() {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SEND);
        accessor.setDestination("/app/mensaje");
        Message<?> msg = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        assertThatCode(() -> interceptor.preSend(msg, channel)).doesNotThrowAnyException();
        verifyNoInteractions(conversacionService);
    }

    private Message<?> buildSubscribeMessage(String destination, Usuario principal) {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        accessor.setDestination(destination);
        if (principal != null) {
            accessor.setUser(principal);
        }
        return MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
    }
}
