import { parseNumber, findInAttributes, isGuidLike } from '../helpers/orderHelpers';

function OrderItem({ item, productCache, index }) {
  const pid = item?.product?.id ?? item?.productId ?? item?.product?.productId;
  const productObj = item?.product ?? (pid && productCache[pid] ? productCache[pid] : null);
  const itemName = productObj?.name ?? item?.name ?? item?.productName ?? 'Item';
  
  const cachedItem = pid && productCache[pid] ? productCache[pid] : null;
  const candidateSku = cachedItem?.sku ?? cachedItem?.code ?? cachedItem?.reference ?? 
    item?.product?.sku ?? item?.product?.code ?? item?.product?.reference ?? 
    item?.sku ?? item?.productSku ?? item?.product?.productCode ?? 
    item?.product?.externalCode ?? item?.product?.product_sku ?? item?.reference ?? 
    findInAttributes(item?.product?.attributes, 'sku') ?? 
    findInAttributes(item?.attributes, 'sku') ?? 
    item?.meta?.sku ?? item?.product?.meta?.sku ?? null;
  
  let sku = '-';
  if (candidateSku && !isGuidLike(candidateSku)) sku = candidateSku;
  
  const qty = item?.quantity ?? item?.qty ?? 0;
  
  if (sku === '-' && item?.product?.reference && !isGuidLike(item.product.reference)) 
    sku = item.product.reference;
  if (sku === '-' && item?.product?.id) 
    sku = `ID:${String(item.product.id).slice(0, 8)}`;
  
  const price = parseNumber(productObj?.currentUnitPrice ?? item?.product?.currentUnitPrice ?? 
    item?.price ?? item?.unitPrice ?? 0) || 0;
  const sub = (qty * price).toFixed(2);

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded p-2 gap-2'>
      <div className='flex-1'>
        <div className='font-semibold'>{itemName}</div>
        <div className='text-sm text-gray-600'>SKU: {sku}</div>
        <div className='text-xs text-gray-500 mt-1'>
          Producto ID: {item?.product?.id ?? item?.productId ?? item?.id ?? '-'}
        </div>
      </div>
      <div className='flex flex-col items-start sm:items-end w-full sm:w-auto'>
        <div className='text-sm'>Cantidad: {qty}</div>
        <div className='text-sm'>Precio: ${price.toFixed(2)}</div>
        <div className='text-sm font-semibold'>Subtotal: ${sub}</div>
      </div>
    </div>
  );
}

export default OrderItem;
