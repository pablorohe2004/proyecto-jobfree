ALTER TABLE mensaje
    ADD COLUMN recibido BIT(1) NOT NULL DEFAULT b'0';

UPDATE mensaje
SET recibido = b'1'
WHERE leido = b'1' AND recibido = b'0';
