import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TiendaCoches.css'; // Archivo CSS personalizado

// Función para obtener la URL completa de la foto
const getPhotoUrl = (photoPath) => {
    const url = `http://localhost:8000/${photoPath}`;
    return url;
};

export default function TiendaCoches() {
    const [coches, setCoches] = useState([]);

    useEffect(() => {
        // Fetch data from la API
        fetch('http://localhost:8000/api/tiendaCoches')
            .then(response => response.json())
            .then(data => {
                setCoches(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center text-warning mb-4">Tienda de Coches</h2>
            <div className="row">
                {coches.map(coche => (
                    <div key={coche.matricula} className="col-md-4 mb-4">
                        <div className="card h-100 tienda-card border border-4 border-dark">
                            <div id={`carousel-${coche.matricula}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {coche.fotos.map((foto, index) => (
                                        <div key={foto.id_foto} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img
                                                src={getPhotoUrl(foto.foto)}
                                                className="d-block w-100 tienda-card-img"
                                                alt={`Foto de ${coche.matricula}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {coche.fotos.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${coche.matricula}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon bg-warning rounded-circle" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${coche.matricula}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon bg-warning rounded-circle" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                )}
                                
                            </div>
                            <div className="card-body text-center ">
                                <h5 className="card-title text-warning">{coche.marca} {coche.modelo}</h5>
                                <div className="row text-left">
                                    {/* Usamos un layout en dos columnas */}
                                    <div className="col-6 text-start fw-bold">Matrícula:</div>
                                    <div className="col-6 text-end">{coche.matricula}</div>
                                    
                                    <div className="col-6 text-start fw-bold">Kilometraje:</div>
                                    <div className="col-6 text-end">{coche.kilometraje}</div>
                                    
                                    <div className="col-6 text-start fw-bold">Tipo combustible:</div>
                                    <div className="col-6 text-end">{coche.tipo_combustible}</div>
                                    
                                    <div className="col-6 text-start fw-bold">Tipo de cambio:</div>
                                    <div className="col-6 text-end">{coche.tipo_cambio}</div>
                                    
                                    <div className="col-6 text-start fw-bold">Año de matriculación:</div>
                                    <div className="col-6 text-end">{coche.año_matriculacion.split('T')[0]}</div>
                                </div>
                                <div className="buttom mt-3 d-flex justify-content-center">
                                    <button className="btn btn-warning w-50">Reservar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
