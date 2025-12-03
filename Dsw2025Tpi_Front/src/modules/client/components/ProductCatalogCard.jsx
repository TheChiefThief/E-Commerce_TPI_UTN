import Card from '../../shared/components/Card';
import AddToCartButton from '../../shared/components/AddToCartButton';

const ProductCard = ({ product, quantity, changeQty, handleAddToCart, isAdmin }) => {
  return (
    <Card key={product.id} className="flex flex-col h-full">
      <div className="h-56 sm:h-44 bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-lg">
        {product.imageUrl ? (
          <img
            src={
              product.imageUrl.startsWith('http')
                ? product.imageUrl
                : product.imageUrl.startsWith('/')
                  ? product.imageUrl
                  : `/products_img/${product.imageUrl}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/404PC.svg';
              e.target.className = "w-full h-full object-contain p-4 opacity-50";
            }}
          />
        ) : (
          <div className="text-gray-300 flex flex-col items-center">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>Sin Imagen</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{product.name || product.title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">{product.description?.slice(0, 60)}</p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">${(product.currentUnitPrice ?? 0).toLocaleString()}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 justify-center w-full max-w-[140px] h-10 shrink-0">
              <button type="button" onClick={() => changeQty(product.id, -1, Number(product.stockQuantity ?? product.stock ?? 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition border border-gray-300 rounded" disabled={quantity <= 1}>−</button>
              <div className="w-10 h-10 flex items-center justify-center text-sm font-medium border border-gray-300 rounded">{Math.min(quantity, Number(product.stockQuantity ?? product.stock ?? Infinity))}</div>
              <button type="button" onClick={() => changeQty(product.id, 1, Number(product.stockQuantity ?? product.stock ?? 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition border border-gray-300 rounded" disabled={quantity >= Number(product.stockQuantity ?? product.stock ?? 0)} title={quantity >= Number(product.stockQuantity ?? product.stock ?? 0) ? 'No hay más stock disponible' : undefined}>+</button>
            </div>

            {!isAdmin && (
              <AddToCartButton
                price={product.currentUnitPrice ?? 0}
                onClick={() => handleAddToCart(product)}
                className="w-full sm:w-auto"
                disabled={quantity > Number(product.stockQuantity ?? product.stock ?? 0) || Number(product.stockQuantity ?? product.stock ?? 0) <= 0}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
