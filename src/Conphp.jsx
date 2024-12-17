import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Esperando archivo...');
  const [accessToken, setAccessToken] = useState(null);

  // Función para redirigir al usuario para autenticarse
  const handleAuthClick = async () => {
    const clientId = '788347178860-f7lotg2vedi2prlg075btqujmn11jnca.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000';  // URL donde el usuario es redirigido después de autenticarse
    const scope = 'https://www.googleapis.com/auth/drive.file';

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
  };

  // Función para extraer el access_token de la URL
  const extractTokenFromUrl = () => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      const refreshToken = new URLSearchParams(hash.substring(1)).get('refresh_token');

      if (token) {
        localStorage.setItem('access_token', token);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        setAccessToken(token);
        setUploadStatus('Autenticación exitosa. Token obtenido.');
        window.location.hash = ''; // Limpiar la URL del token
      } else {
        alert('Token no válido o no encontrado. Por favor, autentica primero.');
      }
    }
  };

  // Función para verificar el token y refrescarlo si es necesario
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response = await axios.post('http://localhost:3001/api/drive_upload.php', {
          refresh_token: refreshToken
        });
        
        if (response.data.success && response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          setAccessToken(response.data.access_token);
        } else {
          alert('No se pudo renovar el token de acceso.');
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        alert('Error al refrescar el token.');
      }
    } else {
      alert('No se ha encontrado un refresh_token. Por favor, autentica primero.');
    }
  };

  // UseEffect para cargar el token desde el almacenamiento local
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setUploadStatus('Token encontrado en almacenamiento local.');
    } else {
      extractTokenFromUrl(); // Intentar extraer el token desde la URL
    }
  }, []);

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 0) {
      setFile(selectedFile);
    }
  };

  // Función para subir el archivo
  const handleFileUpload = async () => {
    if (!file) {
      alert('Selecciona un archivo primero.');
      return;
    }

    let token = accessToken || localStorage.getItem('access_token');
    if (!token) {
      await refreshAccessToken();  // Intentar refrescar el token
      token = localStorage.getItem('access_token');  // Recuperar el nuevo access token
      if (!token) {
        alert('No se pudo obtener un token válido.');
        return;
      }
    }

    setUploadStatus('Subiendo archivo...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:3001/api/drive_upload.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUploadStatus(`Archivo subido con éxito: ${response.data.file_id}`);
      } else {
        setUploadStatus(`Error al subir el archivo: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setUploadStatus('Error al subir el archivo.');
    }
  };

  return (
    <div>
      <h2>Subir archivo a Google Drive</h2>
      {!accessToken && <button onClick={handleAuthClick}>Autenticar con Google</button>}
      {accessToken && (
        <>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Subir archivo</button>
        </>
      )}
      <p>{uploadStatus}</p>
    </div>
  );
};

export default GoogleDriveUpload;
