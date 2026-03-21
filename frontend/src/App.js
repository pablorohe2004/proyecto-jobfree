import './App.css';

// Importamos React Router.
// BrowserRouter envuelve toda la app.
// Routes contiene todas las rutas.
// Route define cada ruta.
// useLocation nos permite saber en qué ruta estamos.
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Componentes comunes de la web pública.
// Navbar = cabecera pública de la web.
// Footer = pie común que queremos mantener también en el panel.
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";

// Páginas públicas que ya tenéis hechas.
import Inicio from "./pages/Inicio/Inicio";
import Servicios from "./pages/Servicios/Servicios";
import Profesionales from "./pages/Profesionales/Profesionales";
import Conocenos from "./pages/Conocenos/Conocenos";
import ParaProfesionales from "./pages/ParaProfesionales/ParaProfesionales";
import Contacto from "./pages/Contacto/Contacto";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";

// Nuevas páginas internas que vamos a usar para entrar
// como cliente o como profesional.
import PanelCliente from "./pages/PanelCliente/PanelCliente";
import PanelProfesional from "./pages/PanelProfesional/PanelProfesional";

// Este componente interno controla qué layout se ve
// dependiendo de la ruta actual.
function AppContent() {
  // Guardamos la ruta actual, por ejemplo:
  // "/", "/servicios", "/panel-cliente", etc.
  const location = useLocation();

  // Aquí indicamos en qué rutas NO queremos enseñar
  // el Navbar público de la web.
  // Lo quitamos porque el panel de usuario tendrá
  // su propia cabecera y su propio menú lateral.
  const rutasSinNavbar = ["/panel-cliente", "/panel-profesional"];

  // Si la ruta actual está dentro del array anterior,
  // ocultamos el Navbar.
  const ocultarNavbar = rutasSinNavbar.includes(location.pathname);

  return (
    <>
      {/* Mostramos el Navbar solo si la ruta NO es una de panel */}
      {!ocultarNavbar && <Navbar />}

      {/* Aquí van todas las rutas de la aplicación */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/profesionales/:id" element={<Profesionales />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/para-profesionales" element={<ParaProfesionales />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Nuevas rutas para los botones de Inicio */}
        <Route path="/panel-cliente" element={<PanelCliente />} />
        <Route path="/panel-profesional" element={<PanelProfesional />} />
      </Routes>

      {/* El Footer sí lo dejamos siempre,
          porque quieres usar el mismo que ya tiene la web */}
      <Footer />
    </>
  );
}

// Componente principal de la app.
// BrowserRouter envuelve toda la navegación.
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;