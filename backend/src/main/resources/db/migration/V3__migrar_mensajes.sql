-- Fase 3
-- Backend requerido: version de transicion que ya escribe por conversacion_id.
-- Objetivo: asociar todos los mensajes legacy a la conversacion canonica de su reserva.

UPDATE mensaje m
INNER JOIN (
    SELECT reserva_id, MIN(id) AS conversacion_canonica_id
    FROM conversacion
    WHERE reserva_id IS NOT NULL
    GROUP BY reserva_id
) cc ON cc.reserva_id = m.reserva_id
SET m.conversacion_id = cc.conversacion_canonica_id
WHERE m.reserva_id IS NOT NULL
  AND (m.conversacion_id IS NULL OR m.conversacion_id <> cc.conversacion_canonica_id);

-- Si existiesen mensajes ya enlazados a una conversacion no canonica, se fuerzan a la canonica.
UPDATE mensaje m
INNER JOIN conversacion c ON c.id = m.conversacion_id
INNER JOIN (
    SELECT reserva_id, MIN(id) AS conversacion_canonica_id
    FROM conversacion
    WHERE reserva_id IS NOT NULL
    GROUP BY reserva_id
) cc ON cc.reserva_id = c.reserva_id
SET m.conversacion_id = cc.conversacion_canonica_id
WHERE c.reserva_id IS NOT NULL
  AND m.conversacion_id <> cc.conversacion_canonica_id;
