import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './utils/AuthContext'; // Asegúrate de que la ruta sea correcta
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Admin from "./components/Admin";
import Formulario from "./components/Formulario";

function App() {
  return (
    <AuthProvider> {/* Envuelve todo con AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/formulario" element={<Formulario />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;