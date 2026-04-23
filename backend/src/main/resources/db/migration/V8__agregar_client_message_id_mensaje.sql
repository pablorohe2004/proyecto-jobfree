ALTER TABLE mensaje
    ADD COLUMN client_message_id VARCHAR(36) NULL;

UPDATE mensaje
SET client_message_id = UUID()
WHERE client_message_id IS NULL OR client_message_id = '';

ALTER TABLE mensaje
    MODIFY client_message_id VARCHAR(36) NOT NULL;

ALTER TABLE mensaje
    ADD UNIQUE KEY uk_mensaje_conversacion_remitente_client_message (
        conversacion_id,
        remitente_id,
        client_message_id
    );
