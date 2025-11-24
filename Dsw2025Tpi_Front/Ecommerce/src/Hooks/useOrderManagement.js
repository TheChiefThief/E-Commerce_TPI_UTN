
import { useState, useCallback } from 'react';
import * as ordersApi from '../API/orders';

export const useOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    // 1. Fetch y Filtrado (Listado de Órdenes Administrativo)
    const fetchOrders = useCallback(async ({ 
        status = '', 
        customerId = '', 
        pageNumber = 1, 
        pageSize = 10 
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama a la API (GET /api/orders) con filtros y paginación [cite: 299-306]
            const response = await ordersApi.getOrders({ status, customerId, pageNumber, pageSize });
            setOrders(response.data);
            setTotalPages(response.totalPages || 1); 
        } catch (err) {
            setError("Error al cargar la lista de órdenes.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Actualizar Estado de una Orden (PUT /api/orders/{id}/status) [cite: 323]
    const updateStatus = async (orderId, newStatus) => {
        try {
            // Llama a la API (solo modificar el estado) [cite: 327]
            const updatedOrder = await ordersApi.updateOrderStatus(orderId, newStatus);
            
            // Actualiza el estado local para reflejar el cambio
            setOrders(prev => 
                prev.map(o => o.id === orderId ? { ...o, status: updatedOrder.status } : o)
            );
            return { success: true };

        } catch (err) {
            const apiMessage = err.response?.data?.message || "Error al cambiar el estado. Verifique que la transición sea válida.";
            return { success: false, message: apiMessage };
        }
    };

    return { orders, isLoading, error, totalPages, fetchOrders, updateStatus };
};