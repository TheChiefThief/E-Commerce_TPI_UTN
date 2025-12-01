import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';

const productStatus = {
  ALL: '',
  ENABLED: 'true',
  DISABLED: 'false',
};

function ListProductsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Cache all fetched products

  const [loading, setLoading] = useState(false);
  const isFirstRun = useRef(true);

  // Fetch total count on initial mount to know exact number of pages
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        // Fetch a large page size to get all products and extract total
        const { data, error } = await getProducts(searchTerm, status, 1, 10000);
        if (error) throw error;

        let totalCount = 0;
        if (Array.isArray(data)) {
          totalCount = data.length;
        } else {
          const items = data.productItems ?? data.products ?? data.items ?? [];
          totalCount = data.total ?? data.totalCount ?? items.length ?? 0;
        }
        setTotal(totalCount);
        console.log('Initial fetch: total products =', totalCount);
      } catch (err) {
        console.error('Error fetching total:', err);
      }
    };
    fetchTotal();
  }, [status]); // Only re-fetch when status filter changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      console.log('API Response:', data, 'Type:', typeof data, 'IsArray:', Array.isArray(data));

      // API may return several shapes:
      // - an array of products
      // - an object with { productItems | products, total | totalCount }
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        const items = data.productItems ?? data.products ?? data.items ?? [];
        setProducts(items);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  // Live search with debounce
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (pageNumber !== 1) {
        setPageNumber(1);
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use exact total count (fetched on mount) to calculate pages
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  const handleSearch = async () => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      await fetchProducts();
    }
  };

  return (
    <div>
      <Card>
        <div className='p-4'>
          <div
            className='flex justify-between items-center mb-3'
          >
            <h1 className='text-2xl sm:text-3xl font-bold'>Productos</h1>
            <Button
              onClick={() => navigate('/admin/products/create')}
              className='h-11 w-11 rounded-2xl sm:hidden'
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
            </Button>

            <Button
              className='hidden sm:block'
              onClick={() => navigate('/admin/products/create')}
            >
              Crear Producto
            </Button>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div
              className='flex items-center gap-3'
            >
              <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-base p-2 border border-gray-300 rounded-lg w-full' />
              <Button className='h-11 w-11' onClick={handleSearch}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </Button>
            </div>
            <select value={status} onChange={evt => setStatus(evt.target.value)} className='text-base p-2 border border-gray-300 rounded-lg'>
              <option value={productStatus.ALL}>Todos</option>
              <option value={productStatus.ENABLED}>Habilitados</option>
              <option value={productStatus.DISABLED}>Inhabilitados</option>
            </select>
          </div>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <span>Buscando datos...</span>
            : products.map(product => {
              const key = product.id ?? product.sku;
              const isOpen = Boolean(expanded[key]);

              return (
                <Card key={product.sku}>
                  <div className="p-4">
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='text-base sm:text-lg font-semibold'>
                          {product.sku ? String(product.sku).replace(/^SKU-/, '') : product.sku} - {product.name}
                        </div>
                        <div className='text-sm text-gray-600 mt-1'>
                          Stock: {product.stockQuantity} - {product.isActive ? 'Activado' : 'Desactivado'}
                        </div>
                      </div>

                      <div className='flex-shrink-0 ml-4'>
                        <Button onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))} className='px-3 py-1'>{isOpen ? 'Ocultar' : 'Ver'}</Button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className='mt-3 border-t pt-3 text-sm text-gray-700'>
                        <div className='flex flex-col sm:flex-row gap-4'>
                          <div className='flex-shrink-0'>
                            {product.imageUrl ? (
                              <img src={
                                product.imageUrl.startsWith('http')
                                  ? product.imageUrl
                                  : product.imageUrl.startsWith('/')
                                    ? product.imageUrl
                                    : `/products_img/${product.imageUrl}`
                              } alt={product.name} className='w-full sm:w-40 h-auto sm:h-28 object-cover rounded-md border' />
                            ) : (
                              <div className='w-full sm:w-40 h-28 bg-gray-100 rounded-md border flex items-center justify-center text-gray-400'>No imagen</div>
                            )}
                          </div>

                          <div className='flex-1 space-y-1'>
                            <div className='mb-1'><strong>SKU completo:</strong> {product.sku ?? '-'}</div>
                            <div className='mb-1'><strong>Precio:</strong> ${Number(product.currentUnitPrice ?? product.price ?? 0).toLocaleString()}</div>
                            <div className='mb-1'><strong>Descripción:</strong> {product.description ?? '-'}</div>
                            <div className='mb-1'><strong>Stock:</strong> {product.stockQuantity ?? '-'}</div>
                            <div className='mb-1'><strong>Estado:</strong> {product.isActive ? 'Activado' : 'Desactivado'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
        }
      </div>

      <div className='flex justify-center items-center gap-2 mt-4 p-4 flex-wrap'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded'
        >
          Anterior
        </button>

        {/* Render page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setPageNumber(page)}
            className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-orange-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3 px-2 py-1 border border-gray-300 rounded-lg'
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>

  );
};

export default ListProductsPage;
