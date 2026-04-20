import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "context/LanguageContext"; 

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

// DASHBOARD
import ClienteDashboard from "pages/dashboard/cliente/ClienteDashboard";
import ProfesionalDashboard from "pages/dashboard/profesional/ProfesionalDashboard";

function App() {
  return (
    <LanguageProvider> 
      <BrowserRouter>

        <Routes>

          {/* páginas con layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/servicios/subcategoria/:id" element={<ServiciosSubcategoria />} />
            <Route path="/profesionales/:id" element={<Profesionales />} />
            <Route path="/conocenos" element={<Conocenos />} />
            <Route path="/para-profesionales" element={<ParaProfesionales />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>

          {/* páginas sin layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* dashboards */}
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
          <Route path="/dashboard/profesional" element={<ProfesionalDashboard />} />

        </Routes>

      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
