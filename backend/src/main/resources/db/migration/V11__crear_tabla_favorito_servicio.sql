CREATE TABLE IF NOT EXISTS favorito_servicio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    fecha_creacion DATETIME(6) NOT NULL,
    cliente_id BIGINT NOT NULL,
    servicio_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_cliente_servicio UNIQUE (cliente_id, servicio_id),
    CONSTRAINT FK_favorito_cliente FOREIGN KEY (cliente_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_favorito_servicio FOREIGN KEY (servicio_id) REFERENCES servicio_ofrecido (id) ON DELETE CASCADE
);
