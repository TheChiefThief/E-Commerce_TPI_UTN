import { getProductImage, formatPrice } from '../helpers/productHelpers';

function ProductDetails({ product }) {
  return (
    <div className='mt-3 border-t pt-3 text-sm text-gray-700'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-shrink-0'>
          {product.imageUrl ? (
            <img 
              src={getProductImage(product.imageUrl)} 
              alt={product.name} 
              className='w-full sm:w-40 h-auto sm:h-28 object-cover rounded-md border' 
            />
          ) : (
            <div className='w-full sm:w-40 h-28 bg-gray-100 rounded-md border flex items-center justify-center text-gray-400'>
              No imagen
            </div>
          )}
        </div>

        <div className='flex-1 space-y-1'>
          <div className='mb-1'>
            <strong>SKU completo:</strong> {product.sku ?? '-'}
          </div>
          <div className='mb-1'>
            <strong>Precio:</strong> {formatPrice(product.currentUnitPrice ?? product.price)}
          </div>
          <div className='mb-1'>
            <strong>Descripción:</strong> {product.description ?? '-'}
          </div>
          <div className='mb-1'>
            <strong>Stock:</strong> {product.stockQuantity ?? '-'}
          </div>
          <div className='mb-1'>
            <strong>Estado:</strong> {product.isActive ? 'Activado' : 'Desactivado'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
