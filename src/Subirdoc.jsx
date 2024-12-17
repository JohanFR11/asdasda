import React, { useState } from 'react';

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Esperando archivo...');

  // Manejar la selección de archivos
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Subir el archivo al backend (y de ahí a Google Drive)
  const handleFileUpload = async () => {
    if (!file) {
      alert('Selecciona un archivo primero');
      return;
    }

    setUploadStatus('Subiendo archivo...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Enviar archivo al servidor backend
      const response = await fetch('http://localhost:5000/upload', {  // URL del servidor
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Archivo subido con éxito');
      } else {
        setUploadStatus('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setUploadStatus('Error al subir el archivo');
    }
  };

  return (
    <div>
      <h2>Subir archivo directamente a Google Drive</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Subir archivo</button>
      </div>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default GoogleDriveUpload;
