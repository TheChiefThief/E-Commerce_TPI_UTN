// src/hooks/useCart.js

import { useState, useEffect, useCallback } from 'react';

// Constante para la clave de localStorage
const CART_STORAGE_KEY = 'cart'; 

/**
 * Hook para manejar el estado y la lógica del carrito de compras.
 * Persiste los datos en localStorage bajo la clave 'cart'. 
 */
export const useCart = () => {
    // Estado del carrito: array de OrderItem simplificados.
    const [cartItems, setCartItems] = useState([]);

    // --- Carga Inicial del Carrito desde localStorage ---
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
                // Parsea el JSON almacenado.
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Error al cargar el carrito de localStorage:", error);
            setCartItems([]); 
        }
    }, []);

    // --- Sincronización del Estado con localStorage ---
    useEffect(() => {
        try {
            // Guarda el estado actual del carrito en localStorage cada vez que cambia.
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [cartItems]);


    // --- Funciones de Lógica de Negocio ---

    const addItemToCart = useCallback((product, quantity = 1) => {
        // Validación: "no puede agregar 0 productos, verificar que el mínimo sea 1" 
        if (quantity < 1) {
            console.error("La cantidad mínima a agregar debe ser 1.");
            return;
        }

        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.productId === product.id
            );

            if (existingItemIndex > -1) {
                // Si el producto ya existe, actualiza la cantidad.
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Si es un producto nuevo, lo agrega al carrito.
                // Usamos el 'currentUnitPrice' del producto como referencia.
                const newItem = {
                    productId: product.id,
                    name: product.name,
                    unitPrice: product.currentUnitPrice, 
                    quantity: quantity,
                };
                return [...prevItems, newItem];
            }
        });
    }, []);

    const updateItemQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) {
            return removeItemFromCart(productId);
        }

        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    }, []);

    const removeItemFromCart = useCallback((productId) => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.productId !== productId)
        );
    }, []);
    
    // Función para vaciar el carrito (usado después de un checkout exitoso)
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // Calcula el subtotal total del carrito.
    const calculateSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) => 
            total + (item.unitPrice * item.quantity), 0);
    }, [cartItems]);

    return {
        cartItems,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        calculateSubtotal,
    };
};