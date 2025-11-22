import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useCartContext } from '../Context/NewCartContext.jsx';
import * as orderApi from '../API/orders.js';
import { useNavigate } from 'react-router-dom';

const SHIPPING_COST = 8.0;

export const useCheckout = () => {
    const { isAuthenticated, user, login } = useAuth();
    const { cartItems, clearCart } = useCartContext();
    const navigate = useNavigate();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const startCheckoutFlow = useCallback(() => {
        if (!cartItems || cartItems.length === 0) {
            setCheckoutError('El carrito está vacío.');
            return;
        }
        if (!isAuthenticated) {
            // Redirigir a la página de login si el usuario no está autenticado.
            // Evita depender de un modal que no está implementado.
            navigate('/login');
            return;
        }
        handleFinalizeOrder();
    }, [isAuthenticated, cartItems]);

    const handleLoginSuccess = useCallback(() => {
        setIsLoginModalOpen(false);
        handleFinalizeOrder();
    }, [/* no deps */]);

    const handleFinalizeOrder = async (
        shippingAddress = 'Casa de dini 1090',
        billingAddress = 'Casa de billy 1090',
        notes = 'Por favor entregar en la puerta'
    ) => {
        if (!cartItems || cartItems.length === 0) {
            setCheckoutError('El carrito está vacío.');
            return;
        }
        const customerId = user?.id;
        if (!customerId) {
            setCheckoutError('Usuario no válido.');
            return;
        }

        const orderItemRequests = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        }));

        const orderData = {
            customerId,
            shippingAddress,
            billingAddress,
            notes,
            orderItems: orderItemRequests,
        };

        setIsProcessing(true);
        setCheckoutError(null);
        try {
            const response = await orderApi.createOrder(orderData);
            clearCart();
            alert(
                `Orden creada exitosamente! Total (sin envío): $${response.totalAmount?.toFixed(2) || '0.00'}`
            );
            navigate('/orders/success');
        } catch (err) {
            const apiMessage = err.response?.data?.message || 'Error al procesar la orden.';
            if (err.response?.status === 400) {
                setCheckoutError(`Error al crear la orden: ${apiMessage}`);
            } else {
                setCheckoutError(`Error del servidor: ${apiMessage}`);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isLoginModalOpen,
        checkoutError,
        isProcessing,
        startCheckoutFlow,
        handleLoginSuccess,
        handleFinalizeOrder,
        login,
    };
};