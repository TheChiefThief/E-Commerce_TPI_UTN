import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const getVal = (o, ...names) => {
    for (const n of names) {
      if (o == null) return undefined;
      if (Object.prototype.hasOwnProperty.call(o, n) && o[n] !== undefined && o[n] !== null) return o[n];
      const lower = n.charAt(0).toLowerCase() + n.slice(1);
      if (o[lower] !== undefined && o[lower] !== null) return o[lower];
      const upper = n.charAt(0).toUpperCase() + n.slice(1);
      if (o[upper] !== undefined && o[upper] !== null) return o[upper];
    }
    return undefined;
  };

  const fetchOrders = async ({ customerName = null, statusFilter = null, pageNumber = 1 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: svcError } = await listOrders({ customerName, status: statusFilter === 'all' ? null : statusFilter, pageNumber, pageSize });
      if (svcError) {
        setError(svcError);
        setOrders([]);
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ pageNumber: page });
  }, [page]);

  const handleSearch = (e) => {
    e && e.preventDefault();
    setPage(1);
    fetchOrders({ customerName: search.trim() === '' ? null : search.trim(), statusFilter: status, pageNumber: 1 });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
    fetchOrders({ customerName: search.trim() === '' ? null : search.trim(), statusFilter: e.target.value, pageNumber: 1 });
  };

  const canNext = orders.length === pageSize;

  return (
    <div>
      <Card>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold'>Ordenes</h2>
          <div className='flex items-center gap-3'>
            <form onSubmit={handleSearch} className='flex items-center gap-2'>
              <Input
                placeholder='Buscar'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-64'
              />
              <Button type='submit' className='h-11 w-11'>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </Button>
            </form>
            <select value={status} onChange={handleStatusChange} className='border rounded p-2'>
              <option value='all'>Estado de Orden</option>
              <option value='PENDING'>PENDING</option>
              <option value='PROCESSING'>PROCESSING</option>
              <option value='SHIPPED'>SHIPPED</option>
              <option value='DELIVERED'>DELIVERED</option>
              <option value='CANCELLED'>CANCELLED</option>
            </select>
          </div>
        </div>

        {loading && <p>Cargando órdenes...</p>}
        {error && console.error('Error cargando órdenes:', error)}

        <div className='space-y-4'>
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
            const customerName = getVal(o, 'customerName', 'CustomerName') || 'Nombre de Cliente';
            const statusVal = getVal(o, 'status', 'Status');
            return (
              <div key={id || Math.random()} className='flex items-center justify-between p-4 border rounded-md bg-white shadow-sm'>
                <div>
                  <div className='text-lg font-semibold'>#{id ? String(id).slice(0, 8) : '#'} - {customerName}</div>
                  <div className='text-sm text-gray-500'>{statusVal}</div>
                </div>
                <div>
                  <Button onClick={() => navigate(`/admin/orders/${id}`)} className='px-4'>Ver</Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination controls */}
        <div className='flex items-center justify-center gap-3 mt-6'>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className='px-3 py-1 rounded disabled:opacity-50'
          >Previous</button>
          <div className='px-3 py-1 border rounded'>{page}</div>
          <button
            onClick={() => { if (canNext) setPage((p) => p + 1); }}
            disabled={!canNext}
            className='px-3 py-1 rounded disabled:opacity-50'
          >Next</button>
        </div>
      </Card>
    </div>
  );
};

export default ListOrdersPage;
