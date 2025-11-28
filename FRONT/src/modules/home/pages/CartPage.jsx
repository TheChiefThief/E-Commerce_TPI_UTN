

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
  const subTotal = item.quantity * item.price; 
  // Usa "Sub Total" con el formato del TPI
  const subTotalDisplay = subTotal.toFixed(2); 

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center p-4">
      
      {/* Columna Izquierda: Nombre, Cantidad de productos, Sub Total */}
      <div className="flex-grow mb-3 sm:mb-0">
        <h3 className="text-xl font-bold text-gray-800">{item.name || "Nombre de producto"}</h3>
        <p className="text-sm text-gray-600">
            Cantidad de productos: #
            <span className='ml-4'>Sub Total: ${subTotalDisplay}</span> 
        </p>
      </div>

      {/* Columna Derecha: Controles y Botón Borrar */}
      <div className="flex items-center space-x-3">
        {/* Botón Restar */}
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md"
          disabled={item.quantity <= 0} // Permitir 0, pero el + solo activa si es > 0
        >
          −
        </button>
        {/* Cantidad actual (simulando el 0 de la imagen) */}
        <span className="w-6 text-center text-lg">{item.quantity}</span>
        {/* Botón Sumar */}
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md"
        >
          +
        </button>
        {/* Botón Borrar */}
        <Button
          onClick={() => removeItem(item.productId)}
          variant="default" // bg-purple-200
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
  // Los datos se cargan desde localStorage, key 'cart' [cite: 604]
  const [cartItems, setCartItems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cargar el carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Calcular totales
  const { totalItems, totalAmount } = useMemo(() => {
    const calculatedItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const calculatedAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    return {
      totalItems: calculatedItems,
      totalAmount: calculatedAmount,
    };
  }, [cartItems]);

  // Persistir cambios
  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  
  // Lógica para actualizar la cantidad
  const updateQuantity = (productId, newQuantity) => {
    // Si la nueva cantidad es 0, no la eliminamos, simplemente la seteamos en 0
    const newCart = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
    );
    saveCart(newCart);
  };

  // Lógica para eliminar un producto (elimina la fila completamente)
  const removeItem = (productId) => {
    const newCart = cartItems.filter(item => item.productId !== productId);
    saveCart(newCart);
  };

  // Función para enviar la orden a la API
  const processOrder = async () => {
    const customerId = localStorage.getItem('customerId');
    
    // NOTA: Si falta el customerId después del login, el flujo falla.
    if (!customerId) {
        alert("Error de autenticación. Por favor, vuelve a iniciar sesión.");
        localStorage.removeItem('userToken');
        setIsLoginModalOpen(true);
        return;
    }

    const orderData = {
      customerId: customerId, 
      shippingAddress: 'Dirección por defecto: C/ Ejemplo, 123',
      billingAddress: 'Dirección por defecto: C/ Ejemplo, 123',
      orderItems: cartItems.filter(item => item.quantity > 0).map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      setIsProcessing(true);
      // *** Aquí iría la llamada REAL a la API POST /api/orders *** [cite: 606]
      console.log('Enviando orden:', orderData);
      
      // Simulación de respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      alert('¡Orden creada exitosamente! Redirigiendo a Productos.');
      
      // Limpiar localStorage, resetear clave 'cart', y redirigir [cite: 607]
      localStorage.removeItem('cart'); 
      setCartItems([]); 
      navigate('/'); 

    } catch (error) {
      console.error(error);
      alert(`Error al procesar la orden: ${error.message || "Fallo de conexión o stock insuficiente."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Lógica de Checkout (Finalizar Compra)
  const handleCheckout = () => {
    const userIsLoggedIn = !!localStorage.getItem('userToken'); 
    
    if (cartItems.length === 0 || totalItems === 0) {
        alert("El carrito está vacío. Agrega productos para continuar.");
        return;
    }

    if (userIsLoggedIn) {
      // Flujo: Usuario ya logeado: se envia la informacion a '/api/orders' [cite: 606]
      processOrder(); 
    } else {
      // Flujo: Usuario no logeado: debe abril una modal [cite: 607]
      setIsLoginModalOpen(true); 
    }
  };

  // Se ejecuta después de que el usuario se loguea en el modal
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false); 
    // Al cerrarse la modal debe enviar los datos a '/api/orders' automáticamente [cite: 607]
    processOrder(); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Usamos Header para la barra superior (Productos, Carrito, Login, Search) */}
      <Header /> 
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Listado de Ítems del Carrito */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="sr-only">Listado de Productos en Carrito</h2>

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
              <Button onClick={() => navigate('/')} className="mt-4">
                Volver a Productos
              </Button>
            </Card>
          )}
        </div>

        {/* Columna Derecha: Detalle del Pedido */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle de pedido</h2>
            
            <div className="space-y-2">
              <p className="flex justify-between text-base">
                <span>Cantidad de en total: #</span> {/* Valor fijo como en la imagen */}
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
              disabled={cartItems.length === 0 || totalItems === 0 || isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
            </Button>
          </Card>
        </div>
      </main>
      
      {/* Modal de Login (Aparece si el usuario no está logueado y presiona Finalizar Compra) */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default CartPage;