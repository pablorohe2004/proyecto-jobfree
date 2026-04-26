package com.jobfree.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Pago;
import com.jobfree.model.enums.EstadoPago;

import java.math.BigDecimal;

@Service
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.api.key}")
    private String apiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final PagoService pagoService;

    public StripeService(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
        log.info("Stripe SDK inicializado");
    }

    /**
     * Crea un PaymentIntent en Stripe para el importe del pago dado.
     * Devuelve el client_secret para que el frontend complete el pago.
     */
    public String crearPaymentIntent(Pago pago) {
        // Stripe opera en centavos (importe × 100)
        long importeCentavos = pago.getImporte()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(importeCentavos)
                    .setCurrency("eur")
                    .putMetadata("pagoId", String.valueOf(pago.getId()))
                    .putMetadata("reservaId", String.valueOf(pago.getReserva().getId()))
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            log.info("PaymentIntent {} creado para pago {}", intent.getId(), pago.getId());
            return intent.getClientSecret();
        } catch (StripeException e) {
            log.error("Error creando PaymentIntent para pago {}: {}", pago.getId(), e.getMessage());
            throw new RuntimeException("Error al iniciar el pago con Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Procesa el evento enviado por el webhook de Stripe.
     * Actualiza el estado del pago en la BD según el resultado.
     */
    public void procesarWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Firma de webhook inválida: {}", e.getMessage());
            throw new SecurityException("Firma de webhook inválida");
        }

        log.info("Webhook Stripe recibido: {}", event.getType());

        switch (event.getType()) {
            case "payment_intent.succeeded" -> manejarPagoExitoso(event);
            case "payment_intent.payment_failed" -> manejarPagoFallido(event);
            default -> log.debug("Evento Stripe ignorado: {}", event.getType());
        }
    }

    private void manejarPagoExitoso(Event event) {
        event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
            PaymentIntent intent = (PaymentIntent) obj;
            String pagoIdStr = intent.getMetadata().get("pagoId");
            if (pagoIdStr != null) {
                Long pagoId = Long.parseLong(pagoIdStr);
                pagoService.actualizarEstado(pagoId, EstadoPago.PAGADO);
                log.info("Pago {} marcado como PAGADO vía Stripe", pagoId);
            }
        });
    }

    private void manejarPagoFallido(Event event) {
        event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
            PaymentIntent intent = (PaymentIntent) obj;
            String pagoIdStr = intent.getMetadata().get("pagoId");
            if (pagoIdStr != null) {
                Long pagoId = Long.parseLong(pagoIdStr);
                pagoService.actualizarEstado(pagoId, EstadoPago.PENDIENTE);
                log.warn("Pago {} falló en Stripe — se mantiene PENDIENTE", pagoId);
            }
        });
    }
}
