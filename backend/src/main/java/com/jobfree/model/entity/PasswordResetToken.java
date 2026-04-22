package com.jobfree.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_token")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime expiracion;

    @Column(nullable = false)
    private boolean usado = false;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, Usuario usuario, LocalDateTime expiracion) {
        this.token = token;
        this.usuario = usuario;
        this.expiracion = expiracion;
    }

    public Long getId() { return id; }

    public String getToken() { return token; }

    public Usuario getUsuario() { return usuario; }

    public LocalDateTime getExpiracion() { return expiracion; }

    public boolean isUsado() { return usado; }

    public void setUsado(boolean usado) { this.usado = usado; }
}
