import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './componentes/home/home.jsx';
import Registro from './componentes/registro/registro.jsx';
import Login from './componentes/login/login.jsx';
import MultiStepForm from './componentes/formularioCompra/formCompra.jsx';
import TiendaCoches from './componentes/tiendaCoches/tiendaCoches.jsx';
import RegistroEmpresaUser from './componentes/registro/registroEmpresaUser.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
                    <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/formCoche" element={<MultiStepForm />} />
                    <Route path="/tiendaCoches" element={<TiendaCoches />} />
                    <Route path="/registroEmpresaUser" element={<RegistroEmpresaUser />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
