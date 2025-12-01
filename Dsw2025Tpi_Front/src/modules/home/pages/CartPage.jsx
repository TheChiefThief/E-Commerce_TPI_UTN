import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Header from '../../shared/components/Header'; 
// import { postOrder } from '../../orders/services/listServices'; 

// --- Componente Modal de Login (Para usuarios no logueados) ---
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // NOTA: En la realidad, esto llamaría a /api/auth/login [cite: 607]
    
    // Simulación de Login Exitoso:
    localStorage.setItem('userToken', 'fake-jwt-token');
    localStorage.setItem('customerId', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
    
    // Continuar con el checkout [cite: 607]
    onLoginSuccess();
    onClose();
  };

  return (
    // Estilos para el overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Iniciar Sesión para Finalizar Compra</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold text-xl">
                &times;
            </button>
        </div>
        
        {/* Formulario de Login como se muestra en la página 11 del TPI */}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Usuario</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-lg"
              required
            />
          </div>
          <Button 
            type="submit" 
            variant="default" // bg-purple-200
            className="w-full py-2 font-semibold text-purple-700"
          >
            Iniciar Sesión
          </Button>
        </form>
        
        {/* Botón Registrar Usuario (simulado, debería navegar a /signup) */}
        <Button 
            onClick={() => navigate('/signup')} 
            variant="secondary" // bg-gray-100
            className="w-full py-2 font-semibold mt-2 text-gray-700"
        >
            Registrar Usuario
        </Button>
      </Card>
    </div>
  );
};


// --- Componente de Fila de Producto en el Carrito ---
const CartItem = ({ item, updateQuantity, removeItem }) => {
  const quantity = Number(item.quantity) || 0;
  // Obtener el precio del producto dentro del objeto item
  const price = Number(item.product?.currentUnitPrice) || Number(item.price) || 0;
  const subTotal = quantity * price;
  const subTotalDisplay = subTotal.toFixed(2);

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center p-4">

      <div className="flex-grow mb-3 sm:mb-0">
        <h3 className="text-xl font-bold text-gray-800">
          {item.product?.name || item.name || "Nombre de producto"}
        </h3>

        <p className="text-sm text-gray-600">
          Cantidad de productos: {quantity}
          <span className="ml-4">Sub Total: ${subTotalDisplay}</span>
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Restar */}
        <button
          onClick={() => updateQuantity(item.productId || item.id, quantity - 1)}
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md"
          disabled={quantity <= 0}
        >
          −
        </button>

        <span className="w-6 text-center text-lg">{quantity}</span>

        {/* Sumar */}
        <button
          onClick={() => updateQuantity(item.productId || item.id, quantity + 1)}
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md"
        >
          +
        </button>

        {/* Borrar */}
        <Button
          onClick={() => removeItem(item.productId || item.id)}
          variant="default"
          className="py-1 px-3 text-purple-700 font-medium"
        >
          Borrar
        </Button>
      </div>
    </Card>
  );
};


// --- Componente Principal CartPage ---
function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      const parsed = JSON.parse(saved).map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        price: Number(item.product?.currentUnitPrice) || Number(item.price) || 0,
        productId: item.productId || item.id
      }));
      setCartItems(parsed);
    }
  }, []);

  const { totalItems, totalAmount } = useMemo(() => {
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { totalItems: items, totalAmount: amount };
  }, [cartItems]);

  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (productId, newQuantity) => {
    const updated = cartItems.map(item =>
      (item.productId === productId || item.id === productId)
        ? { ...item, quantity: Math.max(0, Number(newQuantity) || 0) }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (productId) => {
    const filtered = cartItems.filter(item => item.productId !== productId && item.id !== productId);
    saveCart(filtered);
  };

  const processOrder = async () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      alert("Error de autenticación. Por favor inicia sesión nuevamente.");
      setIsLoginModalOpen(true);
      return;
    }

    const orderData = {
      customerId,
      shippingAddress: "Dirección por defecto",
      billingAddress: "Dirección por defecto",
      orderItems: cartItems
        .filter(i => i.quantity > 0)
        .map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
    };

    try {
      setIsProcessing(true);
      await new Promise(res => setTimeout(res, 1000));

      alert("Orden creada exitosamente");

      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/");
    } catch (err) {
      alert("Error procesando la orden");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0 || totalItems === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const isLogged = !!localStorage.getItem("userToken");

    if (isLogged) processOrder();
    else setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    processOrder();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <CartItem
                key={item.productId}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))
          ) : (
            <Card className="text-center p-10">
              <p className="text-xl text-gray-600">Tu carrito está vacío.</p>
              <Button onClick={() => navigate("/")}>Volver a Productos</Button>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">Detalle de pedido</h2>

            <div className="space-y-2">
              <p className="flex justify-between text-base">
                <span>Cantidad total:</span>
                <span>{totalItems}</span>
              </p>

              <p className="flex justify-between text-lg font-bold">
                <span>Total a pagar:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              variant="default"
              className="w-full mt-6 py-3 font-bold text-purple-700"
              disabled={totalItems === 0 || isProcessing}
            >
              {isProcessing ? "Procesando..." : "Finalizar Compra"}
            </Button>
          </Card>
        </div>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}


export default CartPage;