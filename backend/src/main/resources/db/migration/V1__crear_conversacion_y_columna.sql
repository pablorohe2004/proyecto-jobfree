-- Fase 1
-- Backend requerido: version de transicion que ya conoce la entidad Conversacion
-- pero todavia tolera mensaje.reserva_id como columna legacy.
-- Objetivo: introducir estructura nueva sin forzar todavia la integridad final.

CREATE TABLE IF NOT EXISTS conversacion (
    id BIGINT NOT NULL AUTO_INCREMENT,
    reserva_id BIGINT NULL,
    cliente_id BIGINT NULL,
    profesional_id BIGINT NULL,
    fecha_creacion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE conversacion
    ADD COLUMN IF NOT EXISTS reserva_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS cliente_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS profesional_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS fecha_creacion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE mensaje
    ADD COLUMN IF NOT EXISTS conversacion_id BIGINT NULL;

SET @idx_conversacion_reserva_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND INDEX_NAME = 'idx_conversacion_reserva'
);
SET @idx_conversacion_reserva_sql := IF(
    @idx_conversacion_reserva_exists = 0,
    'ALTER TABLE conversacion ADD INDEX idx_conversacion_reserva (reserva_id)',
    'SELECT 1'
);
PREPARE stmt_idx_conversacion_reserva FROM @idx_conversacion_reserva_sql;
EXECUTE stmt_idx_conversacion_reserva;
DEALLOCATE PREPARE stmt_idx_conversacion_reserva;

SET @idx_conversacion_cliente_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND INDEX_NAME = 'idx_conversacion_cliente'
);
SET @idx_conversacion_cliente_sql := IF(
    @idx_conversacion_cliente_exists = 0,
    'ALTER TABLE conversacion ADD INDEX idx_conversacion_cliente (cliente_id)',
    'SELECT 1'
);
PREPARE stmt_idx_conversacion_cliente FROM @idx_conversacion_cliente_sql;
EXECUTE stmt_idx_conversacion_cliente;
DEALLOCATE PREPARE stmt_idx_conversacion_cliente;

SET @idx_conversacion_prof_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'conversacion'
      AND INDEX_NAME = 'idx_conversacion_profesional'
);
SET @idx_conversacion_prof_sql := IF(
    @idx_conversacion_prof_exists = 0,
    'ALTER TABLE conversacion ADD INDEX idx_conversacion_profesional (profesional_id)',
    'SELECT 1'
);
PREPARE stmt_idx_conversacion_prof FROM @idx_conversacion_prof_sql;
EXECUTE stmt_idx_conversacion_prof;
DEALLOCATE PREPARE stmt_idx_conversacion_prof;

SET @idx_mensaje_conversacion_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'mensaje'
      AND INDEX_NAME = 'idx_mensaje_conversacion'
);
SET @idx_mensaje_conversacion_sql := IF(
    @idx_mensaje_conversacion_exists = 0,
    'ALTER TABLE mensaje ADD INDEX idx_mensaje_conversacion (conversacion_id)',
    'SELECT 1'
);
PREPARE stmt_idx_mensaje_conversacion FROM @idx_mensaje_conversacion_sql;
EXECUTE stmt_idx_mensaje_conversacion;
DEALLOCATE PREPARE stmt_idx_mensaje_conversacion;
