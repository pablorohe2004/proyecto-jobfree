SET @mensaje_reserva_fk := (
    SELECT kcu.CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE kcu
    WHERE kcu.TABLE_SCHEMA = DATABASE()
      AND kcu.TABLE_NAME = 'mensaje'
      AND kcu.COLUMN_NAME = 'reserva_id'
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SET @drop_mensaje_reserva_fk_sql := IF(
    @mensaje_reserva_fk IS NULL,
    'SELECT 1',
    CONCAT('ALTER TABLE mensaje DROP FOREIGN KEY ', @mensaje_reserva_fk)
);
PREPARE stmt_drop_mensaje_reserva_fk FROM @drop_mensaje_reserva_fk_sql;
EXECUTE stmt_drop_mensaje_reserva_fk;
DEALLOCATE PREPARE stmt_drop_mensaje_reserva_fk;

SET @drop_mensaje_reserva_idx_sql := COALESCE((
    SELECT CONCAT('ALTER TABLE mensaje DROP INDEX ', s.INDEX_NAME)
    FROM information_schema.STATISTICS s
    WHERE s.TABLE_SCHEMA = DATABASE()
      AND s.TABLE_NAME = 'mensaje'
      AND s.COLUMN_NAME = 'reserva_id'
      AND s.INDEX_NAME <> 'PRIMARY'
    LIMIT 1
), 'SELECT 1');
PREPARE stmt_drop_mensaje_reserva_idx FROM @drop_mensaje_reserva_idx_sql;
EXECUTE stmt_drop_mensaje_reserva_idx;
DEALLOCATE PREPARE stmt_drop_mensaje_reserva_idx;

SET @drop_mensaje_reserva_col_sql := IF(
    EXISTS(
        SELECT 1
        FROM information_schema.COLUMNS c
        WHERE c.TABLE_SCHEMA = DATABASE()
          AND c.TABLE_NAME = 'mensaje'
          AND c.COLUMN_NAME = 'reserva_id'
    ),
    'ALTER TABLE mensaje DROP COLUMN reserva_id',
    'SELECT 1'
);
PREPARE stmt_drop_mensaje_reserva_col FROM @drop_mensaje_reserva_col_sql;
EXECUTE stmt_drop_mensaje_reserva_col;
DEALLOCATE PREPARE stmt_drop_mensaje_reserva_col;
