import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getVal, formatDateVal, parseNumber } from '../helpers/orderHelpers';
import OrderDetails from './OrderDetails';

function OrderCard({ order, isOpen, onToggle, productCache }) {
  const id = getVal(order, 'id', 'Id');
  const customerName = getVal(order, 'customerName', 'CustomerName') || 'Nombre de Cliente';
  const statusVal = getVal(order, 'status', 'Status');
  const orderDate = formatDateVal(getVal(order, 'createdAt', 'CreatedAt', 'created', 'createdDate', 'date', 'orderDate'));
  
  const orderTotal = (() => {
    const t = getVal(order, 'total', 'amount', 'Total', 'totalAmount', 'grandTotal', 'totalPrice', 'price', 'orderTotal');
    if (t !== undefined && t !== null && String(t).trim() !== '') 
      return '$' + Number(t || 0).toFixed(2);
    
    const items = getVal(order, 'orderItems') || [];
    const computed = items.reduce((s, it) => {
      const qty = Number(it?.quantity ?? it?.qty ?? 0) || 0;
      const price = parseNumber(it?.product?.currentUnitPrice ?? it?.price ?? it?.unitPrice ?? 0) || 0;
      return s + (qty * price);
    }, 0);
    return computed > 0 ? '$' + Number(computed).toFixed(2) : '-';
  })();

  return (
    <Card>
      <div className="p-4">
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <div className='text-base sm:text-lg font-semibold'>
              #{id ? String(id).slice(0, 8) : '#'} - {customerName}
            </div>
            <div className='text-sm text-gray-600 mt-1'>{statusVal}</div>
            <div className='text-xs text-gray-500 mt-1'>
              Fecha: {orderDate} • Total: {orderTotal}
            </div>
          </div>

          <div className='flex-shrink-0 ml-4'>
            <Button onClick={onToggle} className='px-3 py-1'>
              {isOpen ? 'Ocultar' : 'Ver'}
            </Button>
          </div>
        </div>

        {isOpen && (
          <>
            <OrderDetails order={order} productCache={productCache} />
            <div className='mt-3 flex justify-between items-center'>
              <div className='text-sm text-gray-600'>Total: {orderTotal}</div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default OrderCard;
