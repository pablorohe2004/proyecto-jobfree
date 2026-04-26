CREATE TABLE IF NOT EXISTS resena_profesional (
    id BIGINT NOT NULL AUTO_INCREMENT,
    calificacion INT NOT NULL,
    comentario VARCHAR(1000) NOT NULL,
    fecha_creacion DATETIME(6) NOT NULL,
    cliente_id BIGINT NOT NULL,
    profesional_id BIGINT NOT NULL,
    reserva_id BIGINT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FKcliente_resena FOREIGN KEY (cliente_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FKprofesional_resena FOREIGN KEY (profesional_id) REFERENCES profesional_info (id) ON DELETE CASCADE,
    CONSTRAINT FKreserva_resena FOREIGN KEY (reserva_id) REFERENCES reserva (id) ON DELETE SET NULL
);
