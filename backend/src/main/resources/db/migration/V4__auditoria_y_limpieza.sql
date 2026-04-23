-- Fase 4
-- Backend requerido: version de transicion.
-- Objetivo: auditar inconsistencias, preservar trazabilidad y limpiar datos invalidos.

CREATE TABLE IF NOT EXISTS aud_migracion_conversacion (
    auditoria_id BIGINT NOT NULL AUTO_INCREMENT,
    conversacion_id_original BIGINT NOT NULL,
    reserva_id BIGINT NULL,
    cliente_id BIGINT NULL,
    profesional_id BIGINT NULL,
    fecha_creacion DATETIME(6) NULL,
    motivo VARCHAR(100) NOT NULL,
    detalle VARCHAR(255) NULL,
    auditado_en DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (auditoria_id),
    UNIQUE KEY uk_aud_conversacion_motivo (conversacion_id_original, motivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS aud_migracion_mensaje (
    auditoria_id BIGINT NOT NULL AUTO_INCREMENT,
    mensaje_id_original BIGINT NOT NULL,
    contenido VARCHAR(1000) NULL,
    fecha_envio DATETIME(6) NULL,
    leido BIT(1) NULL,
    destinatario_id BIGINT NULL,
    remitente_id BIGINT NULL,
    reserva_id BIGINT NULL,
    conversacion_id BIGINT NULL,
    motivo VARCHAR(100) NOT NULL,
    detalle VARCHAR(255) NULL,
    auditado_en DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (auditoria_id),
    UNIQUE KEY uk_aud_mensaje_motivo (mensaje_id_original, motivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO aud_migracion_conversacion (
    conversacion_id_original, reserva_id, cliente_id, profesional_id, fecha_creacion, motivo, detalle
)
SELECT
    c.id,
    c.reserva_id,
    c.cliente_id,
    c.profesional_id,
    c.fecha_creacion,
    'CONVERSACION_DUPLICADA',
    CONCAT('Se conserva la conversacion canonica ', canon.conversacion_canonica_id)
FROM conversacion c
INNER JOIN (
    SELECT reserva_id, MIN(id) AS conversacion_canonica_id
    FROM conversacion
    WHERE reserva_id IS NOT NULL
    GROUP BY reserva_id
    HAVING COUNT(*) > 1
) canon ON canon.reserva_id = c.reserva_id
WHERE c.id <> canon.conversacion_canonica_id;

INSERT IGNORE INTO aud_migracion_conversacion (
    conversacion_id_original, reserva_id, cliente_id, profesional_id, fecha_creacion, motivo, detalle
)
SELECT
    c.id,
    c.reserva_id,
    c.cliente_id,
    c.profesional_id,
    c.fecha_creacion,
    'CONVERSACION_SIN_RESERVA_VALIDA',
    'La conversacion no apunta a una reserva existente'
FROM conversacion c
LEFT JOIN reserva r ON r.id = c.reserva_id
WHERE c.reserva_id IS NULL OR r.id IS NULL;

INSERT IGNORE INTO aud_migracion_conversacion (
    conversacion_id_original, reserva_id, cliente_id, profesional_id, fecha_creacion, motivo, detalle
)
SELECT
    c.id,
    c.reserva_id,
    c.cliente_id,
    c.profesional_id,
    c.fecha_creacion,
    'CONVERSACION_PARTICIPANTES_INVALIDOS',
    'Los participantes no coinciden con la reserva asociada'
FROM conversacion c
INNER JOIN reserva r ON r.id = c.reserva_id
INNER JOIN servicio_ofrecido s ON s.id = r.servicio_id
INNER JOIN profesional_info p ON p.id = s.profesional_id
WHERE c.cliente_id <> r.cliente_id
   OR c.profesional_id <> p.usuario_id;

INSERT IGNORE INTO aud_migracion_mensaje (
    mensaje_id_original, contenido, fecha_envio, leido, destinatario_id, remitente_id,
    reserva_id, conversacion_id, motivo, detalle
)
SELECT
    m.id, m.contenido, m.fecha_envio, m.leido, m.destinatario_id, m.remitente_id,
    m.reserva_id, m.conversacion_id,
    'MENSAJE_SIN_RESERVA_LEGACY',
    'Mensaje legacy sin reserva de origen'
FROM mensaje m
WHERE m.reserva_id IS NULL;

INSERT IGNORE INTO aud_migracion_mensaje (
    mensaje_id_original, contenido, fecha_envio, leido, destinatario_id, remitente_id,
    reserva_id, conversacion_id, motivo, detalle
)
SELECT
    m.id, m.contenido, m.fecha_envio, m.leido, m.destinatario_id, m.remitente_id,
    m.reserva_id, m.conversacion_id,
    'RESERVA_LEGACY_INEXISTENTE',
    'El mensaje apunta a una reserva que ya no existe'
FROM mensaje m
LEFT JOIN reserva r ON r.id = m.reserva_id
WHERE m.reserva_id IS NOT NULL
  AND r.id IS NULL;

INSERT IGNORE INTO aud_migracion_mensaje (
    mensaje_id_original, contenido, fecha_envio, leido, destinatario_id, remitente_id,
    reserva_id, conversacion_id, motivo, detalle
)
SELECT
    m.id, m.contenido, m.fecha_envio, m.leido, m.destinatario_id, m.remitente_id,
    m.reserva_id, m.conversacion_id,
    'MENSAJE_SIN_CONVERSACION',
    'Tras la migracion no se pudo asignar una conversacion canonica'
FROM mensaje m
WHERE m.conversacion_id IS NULL;

INSERT IGNORE INTO aud_migracion_mensaje (
    mensaje_id_original, contenido, fecha_envio, leido, destinatario_id, remitente_id,
    reserva_id, conversacion_id, motivo, detalle
)
SELECT
    m.id, m.contenido, m.fecha_envio, m.leido, m.destinatario_id, m.remitente_id,
    m.reserva_id, m.conversacion_id,
    'PARTICIPANTES_MENSAJE_INVALIDOS',
    'Remitente o destinatario no pertenecen a la conversacion final'
FROM mensaje m
INNER JOIN conversacion c ON c.id = m.conversacion_id
WHERE m.remitente_id NOT IN (c.cliente_id, c.profesional_id)
   OR m.destinatario_id NOT IN (c.cliente_id, c.profesional_id);

DELETE m
FROM mensaje m
WHERE EXISTS (
    SELECT 1
    FROM aud_migracion_mensaje a
    WHERE a.mensaje_id_original = m.id
);

DELETE c
FROM conversacion c
INNER JOIN aud_migracion_conversacion a
    ON a.conversacion_id_original = c.id
LEFT JOIN mensaje m ON m.conversacion_id = c.id
WHERE a.motivo IN ('CONVERSACION_DUPLICADA', 'CONVERSACION_SIN_RESERVA_VALIDA')
  AND m.id IS NULL;

-- Normalizacion final defensiva de participantes para conversaciones validas.
UPDATE conversacion c
INNER JOIN reserva r ON r.id = c.reserva_id
INNER JOIN servicio_ofrecido s ON s.id = r.servicio_id
INNER JOIN profesional_info p ON p.id = s.profesional_id
SET c.cliente_id = r.cliente_id,
    c.profesional_id = p.usuario_id
WHERE c.reserva_id IS NOT NULL;
