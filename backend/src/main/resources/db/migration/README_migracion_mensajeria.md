# Migracion de mensajeria Reserva -> Conversacion

## Requisitos previos

- Base de datos existente ya baselineada por Flyway.
- `spring.jpa.hibernate.ddl-auto=validate`.
- Deshabilitar cualquier migracion manual tipo `CommandLineRunner`.
- Hacer backup antes de `V1`.

## Orden de despliegue recomendado

### Backend A: version de transicion

Debe incluir:
- entidad `Conversacion`
- `Mensaje` usando `conversacion_id`
- servicios/controladores leyendo y escribiendo por conversacion
- tolerancia a que `mensaje.reserva_id` siga existiendo
- resolucion `reserva -> conversacion` desde backend

Ejecutar con Backend A desplegado:
- `V1__crear_conversacion_y_columna.sql`
- `V2__migrar_conversaciones.sql`
- `V3__migrar_mensajes.sql`
- `V4__auditoria_y_limpieza.sql`

### Verificaciones despues de V4

```sql
SELECT COUNT(*) AS reservas_sin_conversacion
FROM reserva r
LEFT JOIN conversacion c ON c.reserva_id = r.id
WHERE c.id IS NULL;

SELECT reserva_id, COUNT(*) AS total
FROM conversacion
GROUP BY reserva_id
HAVING COUNT(*) > 1;

SELECT COUNT(*) AS mensajes_sin_conversacion
FROM mensaje
WHERE conversacion_id IS NULL;

SELECT COUNT(*) AS mensajes_huerfanos
FROM mensaje m
LEFT JOIN conversacion c ON c.id = m.conversacion_id
WHERE c.id IS NULL;

SELECT COUNT(*) AS mensajes_participantes_invalidos
FROM mensaje m
INNER JOIN conversacion c ON c.id = m.conversacion_id
WHERE m.remitente_id NOT IN (c.cliente_id, c.profesional_id)
   OR m.destinatario_id NOT IN (c.cliente_id, c.profesional_id);

SELECT * FROM aud_migracion_mensaje ORDER BY auditado_en DESC;
SELECT * FROM aud_migracion_conversacion ORDER BY auditado_en DESC;
```

Si todo esta correcto:
- ejecutar `V5__constraints_finales.sql`

### Backend B: version final

Debe incluir:
- ninguna referencia a `mensaje.reserva_id`
- DTOs y queries usando solo `conversacion_id`
- toda insercion nueva de mensajes usando exclusivamente conversacion

Con Backend B ya desplegado:
- ejecutar `V6__eliminar_reserva_id.sql`

## Trazabilidad y datos corruptos

- Los mensajes invalidos no se fuerzan.
- Se copian a `aud_migracion_mensaje`.
- Las conversaciones invalidas o duplicadas se registran en `aud_migracion_conversacion`.
- La tabla activa queda limpia antes de aplicar constraints finales.

## Notas operativas

- `V5` y `V6` incluyen prechecks que deben abortar si el estado no es consistente.
- Si hay alto trafico, ejecutar `V3` y `V4` en ventana controlada para evitar escrituras concurrentes.
- No volver a `ddl-auto=update` tras introducir Flyway.
