import React, { useState } from "react";
import photo from '../logo/Logo.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../logo/logo.css';
import { useNavigate } from 'react-router-dom';
import './login.css';

function recogerDatos(event, navigate, onLogin, setErrorMessage) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let datos = {
        email: email,
        password: password
    };

    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Envías el token
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Login exitoso:", data);
        localStorage.setItem('token', data.token);  
        localStorage.setItem('isLoggedIn', 'true'); 
        onLogin();
        navigate('/');  
    })
    .catch(error => {
        console.error("Error:", error);
        setErrorMessage('Error en el registro. Por favor, intenta nuevamente.');
    });
}


export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        recogerDatos(event, navigate, onLogin, setErrorMessage);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="login-container d-flex">
                <div className="login-left">
                    <img src={photo} alt="Logo" className="login-logo" />
                    <h2 className="text-center text-light mt-4">Inicio de sesión</h2>
                </div>
                <div className="login-right">
                    <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="test@example.com" required />
                        </div>
                        <div className="form-group w-100 text-light mt-3 mb-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="12345*Abaricoque" required />
                        </div>
                        <div className="form-group w-100 text-light d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}