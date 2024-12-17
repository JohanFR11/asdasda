<?php

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuración de la API SAP
$api_url = 'https://my345513.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=TPROD_CAT_UUID,CMATERIAL_UUID,TMATERIAL_UUID,TLOG_AREA_UUID,KCON_HAND_STOCK&$top=99999&$format=json';
$username = 'SEIDORFUNCIONAL';   // Tu usuario de SAP
$password = 'S31d0r*2o24_';       // Tu contraseña de SAP

// Codificar las credenciales en Base64 para autenticación básica
$credentials = base64_encode($username . ':' . $password);

// Inicializar cURL
$ch = curl_init($api_url);

// Establecer las opciones de cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . $credentials,
    'Accept: application/json'
]);

// Ejecutar la solicitud
$response = curl_exec($ch);

// Verificar si hubo algún error con cURL
if ($response === false) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Error en la solicitud a la API SAP: ' . curl_error($ch)]);
    exit();
}

// Cerrar cURL
curl_close($ch);

// Depurar la respuesta de la API (ver los datos que estás obteniendo)
echo "<pre>";
var_dump($response);  // Esto imprimirá la respuesta de la API SAP
echo "</pre>";

?>
