import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState({});
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
        <div className='p-4'>
          <div className='flex justify-between items-center mb-3'>
            <h1 className='text-3xl'>Ordenes</h1>
            <div className='flex items-center gap-3'>
              {/* Optional action buttons could go here */}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex items-center gap-3'>
              <input
                placeholder='Buscar'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='text-[1.3rem] w-full sm:w-64'
              />
              <Button className='h-11 w-11 p-0 flex items-center justify-center' onClick={handleSearch}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </Button>
            </div>
            <select value={status} onChange={handleStatusChange} className='text-[1.3rem]'>
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
            const customerName = getVal(o, 'customerName', 'CustomerName') || 'Nombre de Cliente';
            const statusVal = getVal(o, 'status', 'Status');
            const key = id || Math.random();
            const isOpen = Boolean(expanded[key]);

            return (
              <Card key={key}>
                <div className="p-4">
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='text-lg font-semibold'>#{id ? String(id).slice(0, 8) : '#'} - {customerName}</div>
                      <div className='text-sm text-gray-600 mt-1'>{statusVal}</div>
                    </div>

                    <div className='flex-shrink-0 ml-4'>
                      <Button onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))} className='px-3 py-1'>{isOpen ? 'Ocultar' : 'Ver'}</Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className='mt-3 border-t pt-3 text-sm text-gray-700'>
                      <div className='mb-1'><strong>Estado:</strong> {statusVal}</div>
                      <div className='mb-1'><strong>ID:</strong> {id || '-'}</div>
                      {/* Additional details if present */}
                      <div className='mt-3'>
                        <Button onClick={() => navigate(`/admin/orders/${id}`)} className='px-3 py-1'>Ir al detalle</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
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
    </div>
  );
};

export default ListOrdersPage;
