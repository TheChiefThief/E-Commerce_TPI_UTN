import { useState, useEffect, useCallback } from "react";


const cart_Storage_Key = 'cartItems';


export const useCart = () => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    , [cartItems]);
}