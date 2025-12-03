import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import { listOrders } from '../services/listServices';
import { getProductById } from '../../products/services/getById';
import { getVal } from '../helpers/orderHelpers';
import GenericFilters from '../../shared/components/GenericFilters';
import OrderCard from '../components/OrderCard';
import Pagination from '../../shared/components/Pagination';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [productCache, setProductCache] = useState({});
  const navigate = useNavigate();
  const isFirstRun = useRef(true);

  const fetchOrders = async ({ customerName = null, statusFilter = null, pageNumber = 1, pageS = pageSize } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: svcError } = await listOrders({
        customerName,
        status: statusFilter === 'all' ? null : statusFilter,
        pageNumber,
        pageSize: pageS
      });
      if (svcError) {
        setError(svcError);
        setOrders([]);
      } else {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          const items = data.items ?? data.orderItems ?? data.orders ?? [];
          setOrders(items);
          const totalCount = data.total ?? data.totalCount ?? items.length ?? 0;
          setTotal(totalCount);
        }
      }
    } catch (e) {
      setError(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = async (key, order) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    if (!expanded[key]) {
      const items = getVal(order, 'orderItems') || [];
      const productIdsToFetch = Array.from(
        new Set(items.map(it => it?.product?.id ?? it?.productId)
          .filter(Boolean)
          .filter(pid => !productCache[pid]))
      );
      if (productIdsToFetch.length > 0) {
        for (const pid of productIdsToFetch) {
          try {
            const { data } = await getProductById(pid);
            if (data) setProductCache(prev => ({ ...prev, [pid]: data }));
          } catch (e) {
            // ignore
          }
        }
      }
    }
  };

  const fetchTotal = async ({ customerName = null, statusFilter = null } = {}) => {
    try {
      const { data, error: svcError } = await listOrders({
        customerName,
        status: statusFilter === 'all' ? null : statusFilter,
        pageNumber: 1,
        pageSize: 10000
      });
      if (svcError) {
        setTotal(0);
      } else {
        if (Array.isArray(data)) {
          setTotal(data.length);
        } else {
          const items = data.items ?? data.orderItems ?? data.orders ?? [];
          const t = data.total ?? data.totalCount ?? items.length ?? 0;
          setTotal(t);
        }
      }
    } catch (e) {
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchOrders({
      customerName: search.trim() === '' ? null : search.trim(),
      statusFilter: status,
      pageNumber: page,
      pageS: pageSize
    });
  }, [page, pageSize]);

  useEffect(() => {
    fetchTotal({
      customerName: search.trim() === '' ? null : search.trim(),
      statusFilter: status
    });
    setPage(1);
  }, [status]);



  const handleSearch = (e) => {
    e && e.preventDefault();
    setPage(1);
    const customerName = search.trim() === '' ? null : search.trim();
    fetchTotal({ customerName, statusFilter: status });
    fetchOrders({
      customerName,
      statusFilter: status,
      pageNumber: 1,
      pageS: pageSize
    });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
    fetchOrders({
      customerName: search.trim() === '' ? null : search.trim(),
      statusFilter: e.target.value,
      pageNumber: 1,
      pageS: pageSize
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPage(1);
    setPageSize(newPageSize);
  };

  const totalPages = total > 0 ? Math.ceil(total / pageSize) : Math.max(1, page);
  const canNext = total > 0 ? page < totalPages : orders.length === pageSize;

  return (
    <div>
      <Card>
        <div className='p-4'>
          <GenericFilters
            title="Ordenes"
            searchTerm={search}
            setSearchTerm={setSearch}
            status={status}
            onStatusChange={handleStatusChange}
            onSearch={handleSearch}
            statusOptions={[
              { value: 'all', label: 'TODAS LAS ORDENES' },
              { value: 'PENDING', label: 'PENDING' },
              { value: 'PROCESSING', label: 'PROCESSING' },
              { value: 'SHIPPED', label: 'SHIPPED' },
              { value: 'DELIVERED', label: 'DELIVERED' },
              { value: 'CANCELLED', label: 'CANCELLED' }
            ]}
          />
        </div>

        {loading && <p>Cargando órdenes...</p>}
        {error && console.error('Error cargando órdenes:', error)}
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {!loading && orders.length === 0 && (
          <div className='p-6 text-center text-gray-600'>
            {status && status !== 'all'
              ? `No se encontraron ordenes con el estado ${status}`
              : (search && search.trim() !== ''
                ? `No se encontraron ordenes para "${search.trim()}"`
                : 'No hay órdenes')
            }
          </div>
        )}

        {!loading && orders.map((o) => {
          const id = getVal(o, 'id', 'Id');
          const key = id || Math.random();
          const isOpen = Boolean(expanded[key]);

          return (
            <OrderCard
              key={key}
              order={o}
              isOpen={isOpen}
              onToggle={() => handleToggleExpand(key, o)}
              productCache={productCache}
            />
          );
        })}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        canNext={canNext}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default ListOrdersPage;
