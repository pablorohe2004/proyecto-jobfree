import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Componente que protege rutas privadas (redirige al login si no hay sesión)
import RutaProtegida from "./components/RutaProtegida";

import Layout from "components/layout/public/Layout";

// PUBLIC
import Inicio from "pages/public/Inicio";
import Servicios from "pages/public/servicios/Servicios";
import ServiciosSubcategoria from "pages/public/servicios/ServiciosSubcategoria";
import Profesionales from "pages/public/profesionales/Profesionales";
import Conocenos from "pages/public/Conocenos";
import ParaProfesionales from "pages/public/ParaProfesionales";
import Contacto from "pages/public/Contacto";
import Login from "pages/public/auth/Login";
import Registro from "pages/public/auth/Registro";
import OAuthCallback from "pages/public/auth/OAuthCallback";
import OlvidoPassword from "pages/public/auth/OlvidoPassword";
import ResetearPassword from "pages/public/auth/ResetearPassword";

// DASHBOARD
import ClienteDashboard from "./pages/dashboard/cliente/ClienteDashboard";
import ProfesionalDashboard from "./pages/dashboard/profesional/ProfesionalDashboard";
import MisServicios from "./pages/dashboard/profesional/MisServicios";
import Configuracion from "./pages/dashboard/Configuracion";

function App() {
  return (
    // LanguageProvider gestiona el idioma de la app
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
        <BrowserRouter>
          <Routes>

            {/* ── PÁGINAS PÚBLICAS CON LAYOUT (navbar + footer) ── */}
            <Route element={<Layout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/servicios/subcategoria/:id" element={<ServiciosSubcategoria />} />
              <Route path="/profesionales/:id" element={<Profesionales />} />
              <Route path="/conocenos" element={<Conocenos />} />
              <Route path="/para-profesionales" element={<ParaProfesionales />} />
              <Route path="/contacto" element={<Contacto />} />
            </Route>

            {/* ── AUTENTICACIÓN (sin layout) ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/oauth2/callback" element={<OAuthCallback />} />
            <Route path="/recuperar-password" element={<OlvidoPassword />} />
            <Route path="/reset-password" element={<ResetearPassword />} />

            {/* ── DASHBOARD CLIENTE ──
                RutaProtegida verifica que haya sesión activa con rol "Cliente".
                ClienteDashboard tiene un <Outlet /> donde se renderizan las subrutas internas.
                Las subrutas (reservas, mensajes...) se añadirán aquí cuando existan las páginas. */}
            <Route
              path="/dashboard/cliente"
              element={
                <RutaProtegida rolRequerido="Cliente">
                  <ClienteDashboard />
                </RutaProtegida>
              }
            >
              {/* Ruta raíz del dashboard: mensaje de bienvenida mientras no hay páginas internas */}
              <Route
                index
                element={
                  <p className="text-gray-400 mt-6 text-sm">
                    Bienvenido a tu panel de cliente.
                  </p>
                }
              />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* ── DASHBOARD PROFESIONAL ──
                Igual que el de cliente pero con rol "Profesional". */}
            <Route
              path="/dashboard/profesional"
              element={
                <RutaProtegida rolRequerido="Profesional">
                  <ProfesionalDashboard />
                </RutaProtegida>
              }
            >
              <Route
                index
                element={
                  <p className="text-gray-400 mt-6 text-sm">
                    Bienvenido a tu panel profesional.
                  </p>
                }
              />
              {/* Página para publicar y gestionar servicios */}
              <Route path="servicios" element={<MisServicios />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
