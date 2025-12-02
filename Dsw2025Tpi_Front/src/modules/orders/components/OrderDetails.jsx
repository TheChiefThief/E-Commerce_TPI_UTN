import { getVal, formatDateVal, findInAttributes, isGuidLike } from '../helpers/orderHelpers';
import OrderItem from './OrderItem';

function OrderDetails({ order, productCache }) {
  const statusVal = getVal(order, 'status', 'Status');
  const id = getVal(order, 'id', 'Id');
  
  const orderSkus = Array.from(new Set((getVal(order, 'orderItems') || []).map(it => {
    const pid = it?.product?.id ?? it?.productId ?? it?.product?.productId;
    const cached = pid && productCache[pid] ? productCache[pid] : null;
    const candidate = cached?.sku ?? cached?.code ?? cached?.reference ?? 
      it?.product?.sku ?? it?.product?.code ?? it?.product?.reference ?? 
      it?.sku ?? it?.productSku ?? it?.product?.productCode ?? 
      it?.product?.externalCode ?? it?.product?.product_sku ?? 
      findInAttributes(it?.product?.attributes, 'sku') ?? 
      findInAttributes(it?.attributes, 'sku') ?? 
      it?.meta?.sku ?? it?.product?.meta?.sku ?? (pid || null);
    if (candidate && !isGuidLike(candidate)) return candidate;
    return null;
  }).filter(Boolean)));

  return (
    <div className='mt-3 border-t pt-3 text-sm text-gray-700'>
      <div className='mb-1'><strong>Estado:</strong> {statusVal}</div>
      <div className='mb-1'><strong>ID:</strong> {id || '-'}</div>
      <div className='mb-2'>
        <strong>Fecha:</strong> {formatDateVal(getVal(order, 'createdAt', 'CreatedAt', 'created', 'createdDate', 'date', 'orderDate'))}
      </div>
      <div className='mb-2'>
        <strong>Dirección de envío:</strong> {getVal(order, 'shippingAddress', 'ShippingAddress') ?? '-'}
      </div>
      <div className='mb-2'>
        <strong>Dirección de facturación:</strong> {getVal(order, 'billingAddress', 'BillingAddress') ?? '-'}
      </div>
      <div className='mb-2'>
        <strong>SKU(s):</strong> {(orderSkus.length ? orderSkus.join(', ') : 
          (getVal(order, 'orderItems') || [])
            .map(it => (it?.product?.sku ?? it?.sku ?? it?.productId ?? it?.product?.id))
            .filter(Boolean)
            .map(s => (isGuidLike(s) ? `ID:${String(s).slice(0, 8)}` : s))
            .join(', ')) || '-'}
      </div>

      <div className='mt-3'>
        <h4 className='text-md font-semibold mb-2'>Items</h4>
        <div className='space-y-2'>
          {(getVal(order, 'orderItems') || []).map((it, idx) => (
            <OrderItem key={idx} item={it} productCache={productCache} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
