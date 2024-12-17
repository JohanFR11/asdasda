// GoogleDriveUpload.js
import React, { useState } from 'react';

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Por favor, selecciona un archivo para subir');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Subiendo...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Archivo subido con éxito');
      } else {
        setUploadStatus('Hubo un error al subir el archivo');
      }
    } catch (error) {
      console.error('Error en la subida:', error);
      setUploadStatus('Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Subir archivo a Google Drive</h2>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Subiendo...' : 'Subir archivo'}
        </button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default GoogleDriveUpload;
