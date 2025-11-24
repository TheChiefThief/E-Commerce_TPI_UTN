
import React, { useEffect, useState } from 'react';
// Asume que tienes APIs para obtener conteos:
// import * as adminApi from '../../api/admin'; 

const DashboardPage = () => {
    const [productCount, setProductCount] = useState('#');
    const [orderCount, setOrderCount] = useState('#');

    useEffect(() => {
        // SIMULACIÓN: En una implementación real, llamarías a endpoints /api/dashboard/counts
        const fetchCounts = async () => {
            // const productCount = await adminApi.getProductCount();
            // const orderCount = await adminApi.getOrderCount();
            
            setProductCount(55); // Simulación
            setOrderCount(120); // Simulación
        };
        fetchCounts();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Panel Principal (Administrador)</h1>
            {/* Diseño basado en Page 14 del TPI */}
            
            <div className="dashboard-card">
                <h2>Productos</h2>
                <p>Cantidad de Productos: <strong>{productCount}</strong></p>
            </div>
            
            <div className="dashboard-card">
                <h2>Órdenes</h2>
                <p>Cantidad de Órdenes: <strong>{orderCount}</strong></p>
            </div>
        </div>
    );
};

export default AdminDashboard;