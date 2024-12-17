import React, { useState, useEffect } from 'react';

const PreciosUlefone = ({ data }) => {
    const [stockData, setStockData] = useState({});
    const isDataAvailable = Array.isArray(data) && data.length > 0;

    // Función para obtener los datos de stock desde la API
    const fetchStockData = async (modelo) => {
        try {
            const response = await fetch(
                `https://my345513.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=KCON_HAND_STOCK&$top=1&$filter=CMATERIAL_UUID eq '${modelo}'&$format=json`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${btoa('SEIDORFUNCIONAL:S31d0r*2o24_')}`,
                        'Accept': 'application/json',
                    },
                }
            );
            const result = await response.json();
            const stock = result.d?.results?.[0]?.KCON_HAND_STOCK || 0;
            return stock;
        } catch (error) {
            console.error("Error fetching stock data:", error);
            return 0;
        }
    };

    useEffect(() => {
        if (isDataAvailable) {
            const fetchAllStockData = async () => {
                const stockInfo = {};
                for (const item of data) {
                    const stock = await fetchStockData(item.MODELO);
                    stockInfo[item.MODELO] = stock;
                }
                setStockData(stockInfo);
            };

            fetchAllStockData();
        }
    }, [data]);

    return (
        <div className="container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Moneda</th>
                        <th>Precio Unitario Canal Platinum</th>
                        <th>Precio Unitario Canal Gold</th>
                        <th>Precio Unitario Canal Silver</th>
                        <th>Precio Unitario Seguridad Física/Corporativo</th>
                        <th>Precio Unitario Cliente Final</th>
                        <th>Stock Disponible</th>
                    </tr>
                </thead>
                <tbody>
                    {isDataAvailable ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.MODELO}</td>
                                <td>{item.MONEDA}</td>
                                <td>{item.PRECIO_UNITARIO_CANAL_PLATINUM_Facturacion_Mayor_a_100_Millones}</td>
                                <td>{item.PRECIO_UNITARIO_CANAL_GOLD_Facturacion_entre_50-99_Millones}</td>
                                <td>{item.PRECIO_UNITARIO_CANAL_SILVER_Facturacion_Mayor_a_0-49_Millones}</td>
                                <td>{item.PRECIO_UNITARIO_SEGURIDAD_FISICA_O_CORPORATIVO_PAGO_A_CREDITO}</td>
                                <td>{item.PRECIO_UNITARIO_CLIENTE_FINAL}</td>
                                <td>{stockData[item.MODELO] || "Cargando..."}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No hay datos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PreciosUlefone;
