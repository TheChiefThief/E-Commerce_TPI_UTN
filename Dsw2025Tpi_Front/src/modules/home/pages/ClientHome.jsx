import { useState, useEffect, useRef } from 'react';
import Card from '../../shared/components/Card';
import Header from '../../shared/components/Header';
import { getProductsClient } from '../../products/services/listClient';
import AddToCartButton from '../../shared/components/AddToCartButton';

const ClientHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
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
        const { data } = await getProductsClient(searchTerms || null, null, page, pageSize);

        // API may return { items: [], totalPages } or an array directly
        if (!mounted) return;
        if (data) {
          if (Array.isArray(data)) {
            setProducts(data);
            setTotalPages(1);
          } else if (data.items) {
            setProducts(data.items);
            setTotalPages(data.totalPages || 1);
          } else if (data.data && Array.isArray(data.data)) {
            setProducts(data.data);
            setTotalPages(data.totalPages || 1);
          } else {
            setProducts([]);
            setTotalPages(1);
          }
        } else {
          setProducts([]);
          setTotalPages(1);
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

    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = stored.find((it) => it.id === product.id);
    if (exists) {
      exists.quantity = Math.max(1, (exists.quantity || 0) + minQty);
    } else {
      stored.push({ id: product.id, product, quantity: minQty });
    }

    localStorage.setItem('cart', JSON.stringify(stored));
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  const handleHeaderSearch = (q) => {
    setPage(1);
    setSearchInput(q || '');
  };

  return (
    <>
      <Header onSearch={handleHeaderSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No se encontraron productos</div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full">
                <div className="h-56 sm:h-44 bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-lg">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300">Imagen</div>
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

                      <AddToCartButton
                        price={product.currentUnitPrice ?? 0}
                        onClick={() => handleAddToCart(product)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded" >Anterior</button>
        <div>Pagina {page} / {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
      </div>
    </div>
    </>
  );
};

export default ClientHome;
