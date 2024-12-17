const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Crear la app de Express
const app = express();
const upload = multer({ dest: 'uploads/' }); // Configurar Multer para manejar los archivos subidos

// Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const CLIENT_ID = '500659959638-t603h254muorv3bmm3v0vjq6in7hisuk.apps.googleusercontent.com';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';  // Debes añadir tu client secret aquí
const REDIRECT_URI = 'http://localhost:5000/oauth2callback'; // URL de redirección después de la autenticación

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Endpoint para iniciar el flujo de autenticación OAuth2
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// Endpoint para manejar la subida de archivos
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const authToken = req.headers['authorization'].split(' ')[1]; // Obtener el token del header
    
    oauth2Client.setCredentials({ access_token: authToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Subir archivo a Google Drive
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1CFMfx5iLuGmf9aeA24fyeIMObea-azVa'], // ID de la carpeta
    };

    const media = {
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    fs.unlinkSync(req.file.path); // Eliminar el archivo temporal después de la carga
    res.status(200).json({ fileId: file.data.id });

  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Iniciar el servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
