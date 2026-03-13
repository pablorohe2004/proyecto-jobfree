import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";

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

      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/profesionales/:id" element={<Profesionales />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/para-profesionales" element={<ParaProfesionales />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
