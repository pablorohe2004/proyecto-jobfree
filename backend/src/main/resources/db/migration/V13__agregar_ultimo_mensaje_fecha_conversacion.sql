-- Añade columna para ordenar conversaciones por actividad reciente sin lazy loading
ALTER TABLE conversacion
    ADD COLUMN ultimo_mensaje_fecha DATETIME NULL;

-- Inicializar con la fecha del último mensaje existente
UPDATE conversacion c
SET ultimo_mensaje_fecha = (
    SELECT MAX(m.fecha_envio)
    FROM mensaje m
    WHERE m.conversacion_id = c.id
);
