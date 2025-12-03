import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';
import { productStatus } from '../helpers/productHelpers';
import GenericFilters from '../../shared/components/GenericFilters';
import ProductCard from '../components/ProductCard';
import Pagination from '../../shared/components/Pagination';

function ListProductsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFirstRun = useRef(true);

  const fetchTotal = async () => {
    try {
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
    } catch (err) {
      console.error('Error fetching total:', err);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, [status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

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



  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  const handleSearch = async () => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      await fetchProducts();
    }
    fetchTotal();
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageNumber(1);
    setPageSize(newPageSize);
  };

  const handleToggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <Card>
        <div className='p-4'>
          <GenericFilters
            title="Productos"
            onCreate={() => navigate('/admin/products/create')}
            createLabel="Crear Producto"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            status={status}
            setStatus={setStatus}
            statusOptions={[
              { value: productStatus.ALL, label: 'Todos' },
              { value: productStatus.ENABLED, label: 'Habilitados' },
              { value: productStatus.DISABLED, label: 'Inhabilitados' }
            ]}
          />
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <span>Buscando datos...</span>
        ) : (
          products.map(product => {
            const key = product.id ?? product.sku;
            const isOpen = Boolean(expanded[key]);

            return (
              <ProductCard
                key={product.sku}
                product={product}
                isOpen={isOpen}
                onToggle={() => handleToggleExpand(key)}
              />
            );
          })
        )}
      </div>

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default ListProductsPage;
