-- Fase 2
-- Backend requerido: version de transicion.
-- Objetivo: asegurar una conversacion por reserva y normalizar las ya existentes.

UPDATE conversacion c
INNER JOIN reserva r ON r.id = c.reserva_id
INNER JOIN servicio_ofrecido s ON s.id = r.servicio_id
INNER JOIN profesional_info p ON p.id = s.profesional_id
SET c.cliente_id = r.cliente_id,
    c.profesional_id = p.usuario_id,
    c.fecha_creacion = COALESCE(c.fecha_creacion, r.fecha_creacion, CURRENT_TIMESTAMP(6))
WHERE c.reserva_id IS NOT NULL;

INSERT INTO conversacion (reserva_id, cliente_id, profesional_id, fecha_creacion)
SELECT
    r.id,
    r.cliente_id,
    p.usuario_id,
    COALESCE(r.fecha_creacion, CURRENT_TIMESTAMP(6))
FROM reserva r
INNER JOIN servicio_ofrecido s ON s.id = r.servicio_id
INNER JOIN profesional_info p ON p.id = s.profesional_id
LEFT JOIN conversacion c ON c.reserva_id = r.id
WHERE c.id IS NULL;

-- Normalizacion defensiva adicional por si ya existian conversaciones previas con datos incompletos.
UPDATE conversacion c
INNER JOIN reserva r ON r.id = c.reserva_id
INNER JOIN servicio_ofrecido s ON s.id = r.servicio_id
INNER JOIN profesional_info p ON p.id = s.profesional_id
SET c.cliente_id = COALESCE(c.cliente_id, r.cliente_id),
    c.profesional_id = COALESCE(c.profesional_id, p.usuario_id),
    c.fecha_creacion = COALESCE(c.fecha_creacion, r.fecha_creacion, CURRENT_TIMESTAMP(6))
WHERE c.cliente_id IS NULL
   OR c.profesional_id IS NULL
   OR c.fecha_creacion IS NULL;
