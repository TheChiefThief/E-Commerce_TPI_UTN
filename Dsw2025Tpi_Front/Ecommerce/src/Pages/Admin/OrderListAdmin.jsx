import { useState, useEffect } from 'react';
import { useOrderManagement } from '../../Hooks/useOrderManagement';

const OrderListAdmin = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const { orders, isLoading, error, totalPages, fetchOrders, updateStatus } = useOrderManagement();

    useEffect(() => {
        // Carga de órdenes con filtros
        fetchOrders({ pageNumber, status: statusFilter });
    }, [pageNumber, statusFilter]);

    // Función para cambiar el estado desde la vista
    const handleChangeStatus = async (orderId, newStatus) => {
        const result = await updateStatus(orderId, newStatus);
        if (!result.success) {
            alert(result.message);
        }
    };
    
  
    const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="admin-content-container">
            <h2>Gestión de Órdenes</h2>
            
            
            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="">Todos los Estados</option>
                {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>

            {isLoading && <p>Cargando órdenes...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Listado de Órdenes [cite: 567-574] */}
            {orders.map(order => (
                <div key={order.id} className="order-list-item">
                    <p># {order.id} - Cliente: {order.customerName}</p> 
                    <p>Estado Actual: <strong>{order.status}</strong></p>

                    {/* Botón/Select para cambiar estado */}
                    <select value={order.status} onChange={(e) => handleChangeStatus(order.id, e.target.value)}>
                        {orderStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <button>Ver Detalles</button> {/* Enlace a vista de detalle */}
                </div>
            ))}
            
            {/* Paginación [cite: 575-578] */}
        </div>
    );
};

export default OrderListAdmin;