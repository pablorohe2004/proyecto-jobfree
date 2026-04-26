ALTER TABLE conversacion
    MODIFY reserva_id BIGINT NULL;

ALTER TABLE conversacion
    ADD COLUMN contacto_clave VARCHAR(64) NULL;

ALTER TABLE conversacion
    ADD UNIQUE KEY uk_conversacion_contacto_clave (contacto_clave);
