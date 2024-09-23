import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    permisoCirculacion: null,
    fichaTecnica: null,
    fichaVerde: null,
    fechaDocumentacion: '',
    matricula: '',
    marca: '',
    modelo: '',
    tipo_combustible: '',
    tipo_cambio: '',
    kilometraje: '',
    año_matriculacion: '',
    fotos: []
  });

  const navigate = useNavigate(); // Hook para la navegación

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64File = await toBase64(file);
        setFormData({ ...formData, [e.target.name]: base64File });
      } catch (error) {
        console.error('Error al convertir el archivo a Base64', error);
      }
    }
  };

  const handleMultipleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64FilesPromises = files.map(file => toBase64(file));
    const base64Files = await Promise.all(base64FilesPromises);
    setFormData({ ...formData, fotos: base64Files });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = async (e) => {
    e.preventDefault();
  
    // Prepara el objeto para enviar
    const data = {
      ...formData,
      fotos: formData.fotos // Las fotos ya están en Base64
    };
  
    try {
      const response = await fetch('http://localhost:8000/api/compraCoche', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la solicitud:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
  
      const result = await response.json();
      console.log(result);
  
      // Logging success message with car data excluding photos
      const { fotos, ...carData } = formData;
      console.log('Registro exitoso con los siguientes datos del coche:', carData);
      
      // Navegar a la página de inicio
      alert('Coche añadido correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    }
  };

  return (
    <div className="container mt-4">
      {step === 1 && (
        <div className="bg-light p-4 rounded border border-warning">
          <h2 className="text-center mb-4">Datos del Propietario</h2>
          <form method="POST">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido:</label>
              <input type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" id="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono:</label>
              <input type="text" id="telefono" name="telefono" className="form-control" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-warning me-2" onClick={nextStep}>Siguiente</button>
            </div>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="bg-light p-4 rounded border border-warning">
          <h2 className="text-center mb-4">Documentación del Coche</h2>
          <form method="POST">
            <div className="mb-3">
              <label htmlFor="permisoCirculacion" className="form-label">Permiso de Circulación:</label>
              <input type="file" id="permisoCirculacion" name="permisoCirculacion" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fichaTecnica" className="form-label">Ficha Técnica:</label>
              <input type="file" id="fichaTecnica" name="fichaTecnica" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fichaVerde" className="form-label">Ficha Verde:</label>
              <input type="file" id="fichaVerde" name="fichaVerde" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaDocumentacion" className="form-label">Fecha de Documentación:</label>
              <input type="date" id="fechaDocumentacion" name="fechaDocumentacion" className="form-control" value={formData.fechaDocumentacion} onChange={handleChange} />
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-warning me-2" onClick={prevStep}>Atrás</button>
              <button type="button" className="btn btn-warning" onClick={nextStep}>Siguiente</button>
            </div>
          </form>
        </div>
      )}
      {step === 3 && (
        <div className="bg-light p-4 rounded border border-warning">
          <h2 className="text-center mb-4">Datos del Coche</h2>
          <form method="POST" onSubmit={submitForm}>
            <div className="mb-3">
              <label htmlFor="matricula" className="form-label">Matrícula:</label>
              <input type="text" id="matricula" name="matricula" className="form-control" placeholder="Matrícula" value={formData.matricula} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="marca" className="form-label">Marca:</label>
              <input type="text" id="marca" name="marca" className="form-control" placeholder="Marca" value={formData.marca} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="modelo" className="form-label">Modelo:</label>
              <input type="text" id="modelo" name="modelo" className="form-control" placeholder="Modelo" value={formData.modelo} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label>
              <input type="text" id="tipo_combustible" name="tipo_combustible" className="form-control" placeholder="Tipo de Combustible" value={formData.tipo_combustible} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label>
              <input type="text" id="tipo_cambio" name="tipo_cambio" className="form-control" placeholder="Tipo de Cambio" value={formData.tipo_cambio} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
              <input type="number" id="kilometraje" name="kilometraje" className="form-control" placeholder="Kilometraje" value={formData.kilometraje} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="año_matriculacion" className="form-label">Año de Matrículación:</label>
              <input type="date" id="año_matriculacion" name="año_matriculacion" className="form-control" value={formData.año_matriculacion} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fotos" className="form-label">Fotos del Coche (mínimo 6):</label>
              <input type="file" id="fotos" name="fotos" className="form-control" multiple onChange={handleMultipleFileChange} />
              <small className="form-text text-muted">Selecciona al menos 6 fotos del coche.</small>
            </div>
            <div className="text-center mt-4">
              <button type="button" className="btn btn-warning me-2" onClick={prevStep}>Atrás</button>
              <button type="submit" className="btn btn-warning">Finalizar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
