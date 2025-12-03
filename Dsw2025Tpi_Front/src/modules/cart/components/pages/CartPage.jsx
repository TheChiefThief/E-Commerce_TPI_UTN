import { useState, useEffect } from 'react';
import { useCart } from '../../../shared/context/CartProvider';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Header from '../../../shared/components/Header';
import ModalWrapper from '../../../shared/components/ModalWrapper';
import LoginForm from '../../../auth/components/LoginForm';
import OrderSuccessModal from '../OrderSuccessModal';
import { postOrder } from '../../../orders/services/listServices';
import useAuth from '../../../auth/hook/useAuth';
import CartItem from '../CartItem';
import OrderSummary from '../OrderSummary';


// --- Componente Principal CartPage ---
function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAdmin } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
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

      setOrderSuccessData({
        id: data?.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
        total: totalAmount,
        items: cartItems.length
      });
      setIsSuccessModalOpen(true);
      clearCart();
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
          <OrderSummary
            totalItems={totalItems}
            totalAmount={totalAmount}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            sameAsShipping={sameAsShipping}
            setSameAsShipping={setSameAsShipping}
            shippingError={shippingError}
            billingError={billingError}
            orderNote={orderNote}
            setOrderNote={setOrderNote}
            handleCheckout={handleCheckout}
            isProcessing={isProcessing}
          />
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

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/');
        }}
        orderData={orderSuccessData}
      />
    </div>
  );
}


export default CartPage;