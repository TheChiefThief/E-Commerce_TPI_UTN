import { useState, useEffect, useRef } from 'react';
import Header from '../../shared/components/Header';
import { getProductsClient } from '../../products/services/listClient';
import Button from '../../shared/components/Button';
import { useCart } from '../../shared/context/CartProvider';
import useAuth from '../../auth/hook/useAuth';
import ProductCatalogCard from './ProductCatalogCard';
import Pagination from '../../shared/components/Pagination';

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

  const changeQty = (id, delta, max) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      // Aseguramos que no baje de 1 y no suba más del stock máximo (max)
      const next = Math.max(1, Math.min(current + delta, max || Infinity));
      return { ...prev, [id]: next };
    });
  };


  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    const maxStock = Number(product.stockQuantity ?? product.stock ?? Infinity);
    const minQty = Math.min(maxStock, Math.max(1, qty));
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
            const visibleProducts = products;
            if (visibleProducts.length === 0) {
              return (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4 text-center">No se encontraron productos para tu búsqueda.</p>
                  <Button
                    onClick={() => {
                      setSearchInput('');
                      setPage(1);
                    }}
                    variant="default"
                  >
                    Volver
                  </Button>
                </div>
              );
            }

            return visibleProducts.map((product, index) => (
              <ProductCatalogCard
                key={product.id}
                product={product}
                quantity={quantities[product.id] || 1}
                changeQty={changeQty}
                handleAddToCart={handleAddToCart}
                isAdmin={isAdmin}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ));
          })()}
        </div>

        {products.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            showPageNumbers={false}
            showPageSize={false}
          />
        )}
      </div>
    </>
  );
};

export default ClientHome;
