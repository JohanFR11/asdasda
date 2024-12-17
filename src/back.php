<?php

// Habilitar CORS (si el frontend y el backend están en diferentes dominios)
header('Access-Control-Allow-Origin: *');  // Permite solicitudes desde cualquier origen (ajustar si es necesario)
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuración de la API SAP y las credenciales
$api_url = 'https://my345513.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=TPROD_CAT_UUID,CMATERIAL_UUID,TMATERIAL_UUID,TLOG_AREA_UUID,KCON_HAND_STOCK&$top=99999&$format=json';
$username = 'SEIDORFUNCIONAL';   // Tu usuario de SAP
$password = 'S31d0r*2o24_';       // Tu contraseña de SAP

// Codificar las credenciales en Base64 para autenticación básica
$credentials = base64_encode($username . ':' . $password);

// Inicializar cURL para hacer la solicitud GET a la API
$ch = curl_init($api_url);

// Establecer las opciones de cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . $credentials,
    'Accept: application/json'  // Aceptar respuestas JSON
]);

// Ejecutar la solicitud y obtener la respuesta
$response = curl_exec($ch);

// Verificar si hubo algún error con cURL
if ($response === false) {
    // Si hay un error en la solicitud, devolver un error 500
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Error en la solicitud a la API SAP: ' . curl_error($ch)]);
    exit();
}

// Cerrar la conexión cURL
curl_close($ch);

// Verificar si la respuesta es válida y devolverla
if ($response) {
    // Establecer el encabezado Content-Type como JSON
    header('Content-Type: application/json');
    echo $response;  // Enviar la respuesta de la API SAP al frontend
} else {
    // Si no se recibió respuesta, devolver un error
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'No se recibieron datos de la API SAP']);
}

?>
