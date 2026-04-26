package com.jobfree.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.exception.servicio.ServicioInvalidoException;
import com.jobfree.exception.servicio.ServicioNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.SubcategoriaServicio;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.ReservaRepository;
import com.jobfree.repository.ServicioOfrecidoRepository;

@ExtendWith(MockitoExtension.class)
class ServicioOfrecidoServiceTest {

    @Mock ServicioOfrecidoRepository servicioRepository;
    @Mock ReservaRepository reservaRepository;

    @InjectMocks ServicioOfrecidoService servicioService;

    private Usuario usuarioProfesional;
    private ProfesionalInfo profesional;
    private ServicioOfrecido servicio;
    private SubcategoriaServicio subcategoria;

    @BeforeEach
    void setUp() {
        usuarioProfesional = new Usuario();
        setId(usuarioProfesional, 1L);

        profesional = new ProfesionalInfo();
        setId(profesional, 10L);
        profesional.setUsuario(usuarioProfesional);

        subcategoria = new SubcategoriaServicio();
        setId(subcategoria, 5L);

        servicio = new ServicioOfrecido();
        setId(servicio, 100L);
        servicio.setTitulo("Limpieza");
        servicio.setDescripcion("Limpieza general del hogar");
        servicio.setDuracionMin(60);
        servicio.setPrecioHora(new BigDecimal("20.00"));
        servicio.setProfesional(profesional);
        servicio.setSubcategoria(subcategoria);
    }

    // ── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    void obtenerPorId_existente_retornaServicio() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));

        ServicioOfrecido resultado = servicioService.obtenerPorId(100L);

        assertThat(resultado).isEqualTo(servicio);
    }

    @Test
    void obtenerPorId_inexistente_lanzaServicioNotFoundException() {
        when(servicioRepository.findByIdWithDetails(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servicioService.obtenerPorId(99L))
                .isInstanceOf(ServicioNotFoundException.class);
    }

    // ── crearServicio ─────────────────────────────────────────────────────────

    @Test
    void crearServicio_datosValidos_guardaYRetorna() {
        when(servicioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ServicioOfrecido resultado = servicioService.crearServicio(servicio);

        assertThat(resultado.getTitulo()).isEqualTo("Limpieza");
        verify(servicioRepository).save(servicio);
    }

    @Test
    void crearServicio_sinTitulo_lanzaExcepcion() {
        servicio.setTitulo("");

        assertThatThrownBy(() -> servicioService.crearServicio(servicio))
                .isInstanceOf(ServicioInvalidoException.class)
                .hasMessageContaining("título");
    }

    @Test
    void crearServicio_precioNegativo_lanzaExcepcion() {
        servicio.setPrecioHora(new BigDecimal("-5.00"));

        assertThatThrownBy(() -> servicioService.crearServicio(servicio))
                .isInstanceOf(ServicioInvalidoException.class)
                .hasMessageContaining("Precio");
    }

    @Test
    void crearServicio_duracionCero_lanzaExcepcion() {
        servicio.setDuracionMin(0);

        assertThatThrownBy(() -> servicioService.crearServicio(servicio))
                .isInstanceOf(ServicioInvalidoException.class)
                .hasMessageContaining("Duración");
    }

    // ── actualizarServicio ────────────────────────────────────────────────────

    @Test
    void actualizarServicio_propietario_actualizaCampos() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));
        when(servicioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ServicioOfrecido datos = new ServicioOfrecido();
        datos.setTitulo("Limpieza profunda");
        datos.setPrecioHora(new BigDecimal("25.00"));

        ServicioOfrecido resultado = servicioService.actualizarServicio(100L, datos, 1L);

        assertThat(resultado.getTitulo()).isEqualTo("Limpieza profunda");
        assertThat(resultado.getPrecioHora()).isEqualByComparingTo("25.00");
    }

    @Test
    void actualizarServicio_otroUsuario_lanzaExcepcion() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));

        assertThatThrownBy(() -> servicioService.actualizarServicio(100L, servicio, 999L))
                .isInstanceOf(ServicioInvalidoException.class)
                .hasMessageContaining("permisos");
    }

    // ── activar / desactivar ──────────────────────────────────────────────────

    @Test
    void desactivarServicio_activo_cambiaEstado() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));
        when(servicioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ServicioOfrecido resultado = servicioService.desactivarServicio(100L, 1L);

        assertThat(resultado.isActiva()).isFalse();
    }

    @Test
    void activarServicio_yaActivo_lanzaExcepcion() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));

        assertThatThrownBy(() -> servicioService.activarServicio(100L, 1L))
                .isInstanceOf(ServicioInvalidoException.class)
                .hasMessageContaining("activo");
    }

    // ── eliminarServicio ──────────────────────────────────────────────────────

    @Test
    void eliminarServicio_propietario_eliminaConReservas() {
        when(servicioRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(servicio));
        when(reservaRepository.findByServicioId(100L)).thenReturn(List.of());

        servicioService.eliminarServicio(100L, 1L);

        verify(servicioRepository).delete(servicio);
    }

    // ── Helper para setear ID vía reflexión ───────────────────────────────────

    private static void setId(Object obj, Long id) {
        try {
            var field = obj.getClass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(obj, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
