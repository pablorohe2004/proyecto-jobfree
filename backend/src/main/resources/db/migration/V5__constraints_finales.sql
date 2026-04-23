-- Fase 5
-- Backend requerido: version de transicion ya desplegada y usando solo conversacion para nuevas escrituras.
-- Objetivo: validar estado final y cerrar integridad referencial.

SET @reservas_sin_conversacion := (
    SELECT COUNT(*)
    FROM reserva r
    LEFT JOIN conversacion c ON c.reserva_id = r.id
    WHERE c.id IS NULL
);

SET @conversaciones_duplicadas := (
    SELECT COUNT(*)
    FROM (
        SELECT reserva_id
        FROM conversacion
        WHERE reserva_id IS NOT NULL
        GROUP BY reserva_id
        HAVING COUNT(*) > 1
    ) t
);

SET @mensajes_sin_conversacion := (
    SELECT COUNT(*)
    FROM mensaje
    WHERE conversacion_id IS NULL
);

SET @mensajes_huerfanos := (
    SELECT COUNT(*)
    FROM mensaje m
    LEFT JOIN conversacion c ON c.id = m.conversacion_id
    WHERE c.id IS NULL
);

SET @mensajes_participantes_invalidos := (
    SELECT COUNT(*)
    FROM mensaje m
    INNER JOIN conversacion c ON c.id = m.conversacion_id
    WHERE m.remitente_id NOT IN (c.cliente_id, c.profesional_id)
       OR m.destinatario_id NOT IN (c.cliente_id, c.profesional_id)
);

SET @precheck_total := @reservas_sin_conversacion
                     + @conversaciones_duplicadas
                     + @mensajes_sin_conversacion
                     + @mensajes_huerfanos
                     + @mensajes_participantes_invalidos;

SET @precheck_sql := IF(
    @precheck_total = 0,
    'SELECT 1',
    'SELECT * FROM flyway_precheck_constraints_finales_fallido'
);
PREPARE stmt_precheck FROM @precheck_sql;
EXECUTE stmt_precheck;
DEALLOCATE PREPARE stmt_precheck;

ALTER TABLE conversacion
    MODIFY reserva_id BIGINT NOT NULL,
    MODIFY cliente_id BIGINT NOT NULL,
    MODIFY profesional_id BIGINT NOT NULL,
    MODIFY fecha_creacion DATETIME(6) NOT NULL;

SET @idx_conversacion_reserva_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND INDEX_NAME = 'uk_conversacion_reserva'
);
SET @idx_conversacion_reserva_sql := IF(
    @idx_conversacion_reserva_exists = 0,
    'ALTER TABLE conversacion ADD CONSTRAINT uk_conversacion_reserva UNIQUE (reserva_id)',
    'SELECT 1'
);
PREPARE stmt_idx_conv_reserva FROM @idx_conversacion_reserva_sql;
EXECUTE stmt_idx_conv_reserva;
DEALLOCATE PREPARE stmt_idx_conv_reserva;

SET @fk_conversacion_reserva_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND CONSTRAINT_NAME = 'fk_conversacion_reserva'
);
SET @fk_conversacion_reserva_sql := IF(
    @fk_conversacion_reserva_exists = 0,
    'ALTER TABLE conversacion ADD CONSTRAINT fk_conversacion_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(id)',
    'SELECT 1'
);
PREPARE stmt_fk_conv_reserva FROM @fk_conversacion_reserva_sql;
EXECUTE stmt_fk_conv_reserva;
DEALLOCATE PREPARE stmt_fk_conv_reserva;

SET @fk_conversacion_cliente_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND CONSTRAINT_NAME = 'fk_conversacion_cliente'
);
SET @fk_conversacion_cliente_sql := IF(
    @fk_conversacion_cliente_exists = 0,
    'ALTER TABLE conversacion ADD CONSTRAINT fk_conversacion_cliente FOREIGN KEY (cliente_id) REFERENCES usuario(id)',
    'SELECT 1'
);
PREPARE stmt_fk_conv_cliente FROM @fk_conversacion_cliente_sql;
EXECUTE stmt_fk_conv_cliente;
DEALLOCATE PREPARE stmt_fk_conv_cliente;

SET @fk_conversacion_prof_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND CONSTRAINT_NAME = 'fk_conversacion_profesional'
);
SET @fk_conversacion_prof_sql := IF(
    @fk_conversacion_prof_exists = 0,
    'ALTER TABLE conversacion ADD CONSTRAINT fk_conversacion_profesional FOREIGN KEY (profesional_id) REFERENCES usuario(id)',
    'SELECT 1'
);
PREPARE stmt_fk_conv_prof FROM @fk_conversacion_prof_sql;
EXECUTE stmt_fk_conv_prof;
DEALLOCATE PREPARE stmt_fk_conv_prof;

ALTER TABLE mensaje
    MODIFY conversacion_id BIGINT NOT NULL;

SET @fk_mensaje_conversacion_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'mensaje'
      AND CONSTRAINT_NAME = 'fk_mensaje_conversacion'
);
SET @fk_mensaje_conversacion_sql := IF(
    @fk_mensaje_conversacion_exists = 0,
    'ALTER TABLE mensaje ADD CONSTRAINT fk_mensaje_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversacion(id)',
    'SELECT 1'
);
PREPARE stmt_fk_msg_conv FROM @fk_mensaje_conversacion_sql;
EXECUTE stmt_fk_msg_conv;
DEALLOCATE PREPARE stmt_fk_msg_conv;
