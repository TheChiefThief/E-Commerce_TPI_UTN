import {createNewContext} from 'react';
import {useCart} from '../../hooks/useCart';
// 1. Creación del Contexto
const CartContext = createContext();



export const CartProvider = ({ children }) => {

    // Ejecuta el hook de lógica de negocio para obtener el estado y las funciones
    const cart = useCart();

    // El valor que se proporciona a toda la aplicación
    return (
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    );
};

// 2. Custom Hook para consumir el contexto (opcional, pero buena práctica)
// Nota: En este caso, el hook useCart que ya existe puede actuar como el consumidor, 
// o podemos crear uno simple para obtener el contexto directamente.

const { cartItems, addItemToCart } = useCartContext();
export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext debe ser usado dentro de un CartProvider');
    }
    return context;
};