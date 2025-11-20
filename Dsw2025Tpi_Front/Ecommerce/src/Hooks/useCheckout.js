import {useState, useCallback} from 'react';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import * as OrdertApi from '../Api/orders.js';
import { useNavigate } from 'react-router-dom';


const SHIPPING_COST = 8.00;
export const useCheckout = () => {
    //globales
    const {isAuthenticated, user} = useAuth();
    const {cartItems, clearCart} = useCart();
    const navigate = useNavigate();

    //locales
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [checkouError, setCheckoutError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const startCheckoutFlow = useCallback(( ) => {
        if(cartItems.length === 0){
            setCheckoutError("El carrito está vacío.");
            return;
        }
        if(!isAuthenticated){
            setIsLoginModalOpen(true);
            return;
        }
        else{
            handleFinalizeOrder();
        }
    }, [isAuthenticated, cartItems]);

    const handleLoginSuccess = useCallback(() => {
        setIsLoginModalOpen(false);
        handleFinalizeOrder();
    }, []);

    const handleFinalizeOrder = async (
        shippingAdress = "Casa de dini 1090",
        billingAdress = "Casa de billy 1090",
        notes = "Por favor entregar en la puerta"
    ) => {
        if (cartItems.length === 0) {
            setCheckoutError("El carrito está vacío.");
            return;
        }
        const customerId = user?.id;
        if (!customerId) {
            setCheckoutError("Usuario no válido.");
            return;
        }
        const orderItemRequests = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        }));
        const orderData = {
            customerId,
            shippingAdress,
            billingAdress,
            notes,
            orderItems: orderItemRequests,
        };

        setIsProcessing(true);
        setCheckoutError(null);
        try {
            const response = await OrdertApi.createOrderApi(orderData);
            clearCart();
            alert(`Orden #${response.orderId} creada exitosamente!, Total: $${(response.totalAmount+SHIPPING_COST).toFixed(2)}`);
            navigate('/orders/success');
        } catch (error) {
            const apiMessage = error.response?.data?.message || "Error al procesar la orden.";
            if(error.response?.status === 400){
                setCheckoutError(`Error al crear la orden: ${apiMessage}`);
            } else {
                setCheckoutError(`Error del servidor: ${apiMessage}`);
            }
        } finally {
            setIsProcessing(false);
        }
    return {
        isLoginModalOpen,
        checkoutError,
        isProcessing,
        startCheckoutFlow,
        handleLoginSuccess,
        handleFinalizeOrder,
        login: useAuth().login, // Expone la función de login para el modal
    };
}      
};