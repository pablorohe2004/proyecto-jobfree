-- Fase 6
-- Backend requerido: version final, sin ninguna dependencia de mensaje.reserva_id.
-- Ejecutar solo cuando la aplicacion en produccion lleve ya desplegada la version final.

SET @mensajes_sin_conversacion_final := (
    SELECT COUNT(*)
    FROM mensaje
    WHERE conversacion_id IS NULL
);

SET @precheck_drop_sql := IF(
    @mensajes_sin_conversacion_final = 0,
    'SELECT 1',
    'SELECT * FROM flyway_precheck_drop_reserva_id_fallido'
);
PREPARE stmt_precheck_drop FROM @precheck_drop_sql;
EXECUTE stmt_precheck_drop;
DEALLOCATE PREPARE stmt_precheck_drop;

SET @fk_reserva_id_name := (
    SELECT kcu.CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE kcu
    WHERE kcu.TABLE_SCHEMA = DATABASE()
      AND kcu.TABLE_NAME = 'mensaje'
      AND kcu.COLUMN_NAME = 'reserva_id'
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SET @drop_fk_sql := IF(
    @fk_reserva_id_name IS NULL,
    'SELECT 1',
    CONCAT('ALTER TABLE mensaje DROP FOREIGN KEY ', @fk_reserva_id_name)
);
PREPARE stmt_drop_fk FROM @drop_fk_sql;
EXECUTE stmt_drop_fk;
DEALLOCATE PREPARE stmt_drop_fk;

SET @drop_idx_reserva_sql := COALESCE((
    SELECT CONCAT('ALTER TABLE mensaje DROP INDEX ', INDEX_NAME)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'mensaje'
      AND COLUMN_NAME = 'reserva_id'
      AND INDEX_NAME <> 'PRIMARY'
    LIMIT 1
), 'SELECT 1');
PREPARE stmt_drop_idx_reserva FROM @drop_idx_reserva_sql;
EXECUTE stmt_drop_idx_reserva;
DEALLOCATE PREPARE stmt_drop_idx_reserva;

ALTER TABLE mensaje
    DROP COLUMN IF EXISTS reserva_id;
