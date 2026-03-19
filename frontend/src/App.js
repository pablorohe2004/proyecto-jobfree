import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Inicio from "./pages/Inicio/Inicio";
import Servicios from "./pages/Servicios/Servicios";
import Profesionales from "./pages/Profesionales/Profesionales";
import Conocenos from "./pages/Conocenos/Conocenos";
import ParaProfesionales from "./pages/ParaProfesionales/ParaProfesionales";
import Contacto from "./pages/Contacto/Contacto";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* páginas con layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/profesionales/:id" element={<Profesionales />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/para-profesionales" element={<ParaProfesionales />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>

        {/* páginas sin layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
