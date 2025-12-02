import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

const OrderSummary = ({
  totalItems,
  totalAmount,
  shippingAddress,
  setShippingAddress,
  billingAddress,
  setBillingAddress,
  sameAsShipping,
  setSameAsShipping,
  shippingError,
  billingError,
  orderNote,
  setOrderNote,
  handleCheckout,
  isProcessing
}) => {
  return (
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
  );
};

export default OrderSummary;
