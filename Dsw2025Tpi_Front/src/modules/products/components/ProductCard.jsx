import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import ProductDetails from './ProductDetails';
import { formatSku } from '../helpers/productHelpers';

function ProductCard({ product, isOpen, onToggle }) {
  return (
    <Card>
      <div className="p-4">
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <div className='text-base sm:text-lg font-semibold'>
              {formatSku(product.sku)} - {product.name}
            </div>
            <div className='text-sm text-gray-600 mt-1'>
              Stock: {product.stockQuantity} - {product.isActive ? 'Activado' : 'Desactivado'}
            </div>
          </div>

          <div className='flex-shrink-0 ml-4'>
            <Button onClick={onToggle} className='px-3 py-1'>
              {isOpen ? 'Ocultar' : 'Ver'}
            </Button>
          </div>
        </div>

        {isOpen && <ProductDetails product={product} />}
      </div>
    </Card>
  );
}

export default ProductCard;
