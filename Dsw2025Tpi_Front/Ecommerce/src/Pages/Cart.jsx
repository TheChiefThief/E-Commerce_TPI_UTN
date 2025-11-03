import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout'; // Para iniciar el flujo de compra
import Layout from '../../components/layout/Layout';
import LoginModal from '../../components/common/LoginModal'; // Necesario para el flujo de checkout

const SHIPPING_COST = 8.00; // Costo fijo de envío

const CartPage = () => {
    const { cartItems, updateItemQuantity, removeItemFromCart, calculateSubtotal } = useCart();
    const { 
        isLoginModalOpen, 
        checkoutError, 
        isProcessing, 
        startCheckoutFlow, 
        handleLoginSuccess,
        login
    } = useCheckout();

    const subtotal = calculateSubtotal();
    const total = subtotal + SHIPPING_COST; 

    // Muestra un mensaje si el carrito está vacío
    if (cartItems.length === 0) {
        return (
            <Layout>
                <div className="cart-container-empty">
                    <h2>Tu Carrito de Compras</h2>
                    <p>No hay productos en tu carrito.</p>
                </div>
            </Layout>
        );
    }
    
    // Función para actualizar la cantidad con los botones +/-
    const handleQuantityChange = (productId, delta) => {
        const item = cartItems.find(i => i.productId === productId);
        if (item) {
            updateItemQuantity(productId, item.quantity + delta);
        }
    };

    return (
        <Layout>
            <div className="cart-container">
                <h2>Tu Carrito de Compras</h2> {/* */}
                {checkoutError && <div className="error-message">{checkoutError}</div>}

                {/* Listado de Ítems del Carrito */}
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        <div key={item.productId} className="cart-item">
                            <span className="item-name">{item.name}</span> {/* */}
                            
                            <div className="quantity-controls">
                                <button onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
                                <span className="item-quantity">Cantidad: {item.quantity}</span> {/* */}
                                <button onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                            </div>
                            
                            <span className="item-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                            
                            <button 
                                className="item-remove-btn" 
                                onClick={() => removeItemFromCart(item.productId)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                {/* Resumen de la Orden */}
                <div className="order-summary">
                    <h3>Sumario orders</h3> {/* */}
                    <p>Subotal: ${subtotal.toFixed(2)}</p> {/* */}
                    <p>Envío: ${SHIPPING_COST.toFixed(2)}</p> {/* */}
                    <h4>Total: ${total.toFixed(2)}</h4> {/* */}
                </div>

                <button 
                    onClick={startCheckoutFlow} 
                    disabled={isProcessing}
                    className="finalize-btn">
                    {isProcessing ? 'Procesando...' : 'Finalizar Compra'} {/* */}
                </button>
            </div>
            
            {/* Modal de Login condicional */}
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => isProcessing ? null : startCheckoutFlow()} // Evitar cerrar si está procesando
                onLoginSuccess={handleLoginSuccess}
                loginFunction={login} 
            />
        </Layout>
    );
};

export default CartPage;
