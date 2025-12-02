import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const quantity = Number(item.quantity) || 0;
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

export default CartItem;
