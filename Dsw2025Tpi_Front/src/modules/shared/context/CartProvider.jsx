import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        price: Number(item.product?.currentUnitPrice) || Number(item.price) || 0,
        productId: item.productId || item.id || (item.product?.id)
      }));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems(prev => {
      const exists = prev.find(i => (i.productId || i.id) === (product.id));
      if (exists) {
        return prev.map(i => ((i.productId || i.id) === product.id) ? ({ ...i, quantity: (Number(i.quantity) || 0) + qty }) : i);
      }
      return [...prev, { id: product.id, productId: product.id, product, quantity: qty, price: Number(product.currentUnitPrice) || 0 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prev => prev.map(i => ((i.productId || i.id) === productId) ? ({ ...i, quantity: Math.max(0, Number(newQuantity) || 0) }) : i));
  };

  const removeItem = (productId) => {
    setCartItems(prev => prev.filter(i => (i.productId || i.id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(() => cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0), [cartItems]);
  const totalAmount = useMemo(() => cartItems.reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartProvider;
