import { useState, useEffect, useRef } from 'react';
import Card from '../../shared/components/Card';
import Header from '../../shared/components/Header';
import { getProductsClient } from '../../products/services/listClient';

import AddToCartButton from '../../shared/components/AddToCartButton';
import { useCart } from '../../shared/context/CartProvider';
import useAuth from '../../auth/hook/useAuth';

const ClientHome = () => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [quantities, setQuantities] = useState({});
  const debounceRef = useRef(null);

  // Debounce search input -> searchTerms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearchTerms(searchInput.trim());
    }, 450);

    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  // Load products when searchTerms or page changes
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        // Fetch total count for pagination
        // We fetch a large number to get the total count of active products
        // This is a workaround because the API doesn't return total count in the paginated response
        const totalResponse = await getProductsClient(searchTerms || null, 'true', 1, 10000);
        let totalCount = 0;
        if (totalResponse.data) {
          if (Array.isArray(totalResponse.data)) {
            totalCount = totalResponse.data.length;
          } else if (totalResponse.data.items) {
            totalCount = totalResponse.data.items.length;
          }
        }
        setTotalPages(Math.ceil(totalCount / pageSize));

        const { data } = await getProductsClient(searchTerms || null, 'true', page, pageSize);

        if (!mounted) return;
        if (data) {
          if (Array.isArray(data)) {
            setProducts(data);
          } else if (data.items) {
            setProducts(data.items);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [searchTerms, page, pageSize]);

  const changeQty = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };


  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    const minQty = Math.max(1, qty);
    addToCart(product, minQty);
  };

  const handleHeaderSearch = (value) => {
    setSearchInput(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Header onSearch={handleHeaderSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(() => {
            const visibleProducts = products.filter(p => Number(p.stockQuantity ?? p.stock ?? 0) >= 1);
            if (visibleProducts.length === 0) {
              return (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">No se encontraron productos</p>
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setPage(1);
                    }}
                    className="bg-orange-200 text-orange-800 font-semibold py-2 px-6 rounded-lg hover:bg-orange-300 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              );
            }

            return visibleProducts.map((product) => (
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
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name || product.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{product.description?.slice(0, 60)}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${(product.currentUnitPrice ?? 0).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button type="button" onClick={() => changeQty(product.id, -1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition">−</button>
                        <div className="w-8 text-center text-sm font-medium">{quantities[product.id] || 1}</div>
                        <button type="button" onClick={() => changeQty(product.id, 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition">+</button>
                      </div>

                      {!isAdmin && (
                        <AddToCartButton
                          price={product.currentUnitPrice ?? 0}
                          onClick={() => handleAddToCart(product)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ));
          })()}
        </div>

        {products.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded" >Anterior</button>
            <div>Pagina {page} / {totalPages}</div>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientHome;
