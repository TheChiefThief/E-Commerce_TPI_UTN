import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../shared/context/CartProvider';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Header from '../../shared/components/Header';
import ModalWrapper from '../../shared/components/ModalWrapper';
import LoginForm from '../../auth/components/LoginForm';
import { postOrder } from '../../orders/services/listServices';
import useAuth from '../../auth/hook/useAuth';

// Using `LoginForm` and `ModalWrapper` imported above


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
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md disabled:text-gray-300 disabled:border-gray-200 disabled:bg-transparent disabled:cursor-not-allowed"
          disabled={quantity <= 1}
        >
          −
        </button>

        <span className="w-6 text-center text-lg">{quantity}</span>

        {/* Sumar */}
        <button
          onClick={() => updateQuantity(item.productId || item.id, quantity + 1)}
          className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 border rounded-md"
          disabled={quantity >= Number(item.product?.stockQuantity ?? item.product?.stock ?? 0)}
          title={quantity >= Number(item.product?.stockQuantity ?? item.product?.stock ?? 0) ? 'No hay más stock disponible' : undefined}
        >
          +
        </button>

        {/* Borrar */}
        <Button
          onClick={() => removeItem(item.productId || item.id)}
          variant="default"
          className="py-1 px-3 text-orange-800 font-medium"
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
  const { cartItems, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAdmin } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [billingError, setBillingError] = useState('');
  const [orderNote, setOrderNote] = useState('');

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/home');
    }
  }, [isAdmin, navigate]);

  const processOrder = async () => {
    // Validate addresses first
    setShippingError('');
    setBillingError('');
    if (!shippingAddress || !shippingAddress.trim()) {
      setShippingError('La dirección de envío es obligatoria');
      return;
    }
    const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
    if (!finalBilling || !finalBilling.trim()) {
      setBillingError('La dirección de facturación es obligatoria');
      return;
    }

    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      alert("Error de autenticación. Por favor inicia sesión nuevamente.");
      setIsLoginModalOpen(true);
      return;
    }

    const orderData = {
      customerId,
      shippingAddress: shippingAddress,
      billingAddress: finalBilling,
      description: orderNote,
      orderItems: cartItems
        .filter(i => i.quantity > 0)
        .map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
    };

    try {
      setIsProcessing(true);


      const { data, error, status } = await postOrder(orderData);
      if (error) {
        // If the API returns NotFound for the given customerId, fallback to local order creation so admin can still see it.
        console.error('postOrder error', error, status);
        const detail = (error && (error.detail || error.message || '')).toString();
        const title = (error && error.title) || '';
        const isNotFound = (status === 404) || /notfound/i.test(title) || /cliente/i.test(detail) || /cliente/i.test(title);
        if (isNotFound) {
          // If the server returned NotFound for the given customer, instruct the user to login or register.
          alert('Error creando la orden: el cliente no existe en el servidor. Por favor, inicia sesión o registra un cliente válido antes de finalizar la compra.');
          return;
        }
        // Show a readable error if possible and guide to login for auth issues
        const errMsg = (error && (error.detail || error.message || error.title)) || JSON.stringify(error);
        if (status === 401 || status === 403) {
          alert('No autorizado: por favor inicia sesión con un usuario válido para crear la orden.');
          setIsLoginModalOpen(true);
          return;
        }
        alert('Error procesando la orden: ' + errMsg + '\nSi el problema persiste, por favor inicia sesión y verifica tu cuenta.');
        return;
      }

      alert('Orden creada exitosamente');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error('Unexpected error creating order', err);
      alert('Error procesando la orden');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0 || totalItems === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Validate addresses before proceeding
    setShippingError('');
    setBillingError('');
    if (!shippingAddress || !shippingAddress.trim()) {
      setShippingError('La dirección de envío es obligatoria');
      return;
    }
    const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
    if (!finalBilling || !finalBilling.trim()) {
      setBillingError('La dirección de facturación es obligatoria');
      return;
    }

    const isLogged = !!localStorage.getItem("token");

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

              <div className="mt-4 space-y-3">
                <Input
                  label="Dirección de envío"
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (sameAsShipping) setBillingAddress(e.target.value);
                  }}
                  error={shippingError}
                />

                <div className="flex items-center gap-3">
                  <input id="sameAsShipping" type="checkbox" checked={sameAsShipping} onChange={(e) => {
                    setSameAsShipping(e.target.checked);
                    if (e.target.checked) setBillingAddress(shippingAddress);
                  }} />
                  <label htmlFor="sameAsShipping" className="text-sm text-gray-700">Usar misma dirección para facturación</label>
                </div>

                {!sameAsShipping && (
                  <Input
                    label="Dirección de facturación"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    error={billingError}
                  />
                )}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nota opcional</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none overflow-y-auto"
                    rows="2"
                    placeholder="Instrucciones especiales..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="default"
              className="w-full mt-6 py-3 font-bold text-orange-800"
              disabled={
                totalItems === 0 || isProcessing ||
                !shippingAddress || !shippingAddress.trim() ||
                (!sameAsShipping && (!billingAddress || !billingAddress.trim()))
              }
            >
              {isProcessing ? "Procesando..." : "Finalizar Compra"}
            </Button>
          </Card>
        </div>
      </main>

      {isLoginModalOpen && (
        <ModalWrapper title="Iniciar Sesión" onClose={() => setIsLoginModalOpen(false)}>
          <LoginForm
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={handleLoginSuccess}
            openSignup={() => { setIsLoginModalOpen(false); navigate('/signup'); }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}


export default CartPage;