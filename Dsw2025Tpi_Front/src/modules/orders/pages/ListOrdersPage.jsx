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
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState({});
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

  const fetchOrders = async ({ customerName = null, statusFilter = null, pageNumber = 1, pageS = pageSize } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: svcError } = await listOrders({ customerName, status: statusFilter === 'all' ? null : statusFilter, pageNumber, pageSize: pageS });
      if (svcError) {
        setError(svcError);
        setOrders([]);
      } else {
        // If server returns a structured object, try to detect items; otherwise, fallback to array
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

  // Fetch total count so we can render exact page numbers, like products list
  const fetchTotal = async ({ customerName = null, statusFilter = null } = {}) => {
    try {
      const { data, error: svcError } = await listOrders({ customerName, status: statusFilter === 'all' ? null : statusFilter, pageNumber: 1, pageSize: 10000 });
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
    fetchOrders({ pageNumber: page, pageS: pageSize });
  }, [page, pageSize]);

  // When status or search changes, refetch total to compute pages accurately.
  useEffect(() => {
    fetchTotal({ customerName: search.trim() === '' ? null : search.trim(), statusFilter: status });
    setPage(1);
  }, [status, search]);

  const handleSearch = (e) => {
    e && e.preventDefault();
    setPage(1);
    fetchOrders({ customerName: search.trim() === '' ? null : search.trim(), statusFilter: status, pageNumber: 1, pageS: pageSize });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
    fetchOrders({ customerName: search.trim() === '' ? null : search.trim(), statusFilter: e.target.value, pageNumber: 1, pageS: pageSize });
  };

  // Calculate total pages from server-provided total (if available) or fallback to page-by-page method
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : Math.max(1, page);
  const canNext = total > 0 ? page < totalPages : orders.length === pageSize;

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
                    {/* Show more details inline: addresses, timestamps, order items, totals, etc. */}
                    <div className='mb-2'><strong>Fecha:</strong> {getVal(o, 'createdAt', 'CreatedAt', 'created') || '-'}</div>
                    <div className='mb-2'><strong>Dirección de envío:</strong> {getVal(o, 'shippingAddress', 'ShippingAddress') ?? '-'}</div>
                    <div className='mb-2'><strong>Dirección de facturación:</strong> {getVal(o, 'billingAddress', 'BillingAddress') ?? '-'}</div>

                    <div className='mt-3'>
                      <h4 className='text-md font-semibold mb-2'>Items</h4>
                      <div className='space-y-2'>
                        {(getVal(o, 'orderItems') || []).map((it, idx) => {
                          const itemName = it?.product?.name ?? it?.name ?? it?.productName ?? 'Item';
                          const sku = it?.product?.sku ?? it?.sku ?? it?.productSku ?? '-';
                          const qty = it?.quantity ?? it?.qty ?? 0;
                          const price = Number(it?.product?.currentUnitPrice ?? it?.price ?? it?.unitPrice ?? 0);
                          const sub = (qty * price).toFixed(2);
                          return (
                            <div key={idx} className='flex items-center justify-between border rounded p-2'>
                              <div className='flex-1'>
                                <div className='font-semibold'>{itemName}</div>
                                <div className='text-sm text-gray-600'>SKU: {sku}</div>
                              </div>
                              <div className='flex flex-col items-end'>
                                <div className='text-sm'>Cantidad: {qty}</div>
                                <div className='text-sm'>Precio: ${price.toFixed(2)}</div>
                                <div className='text-sm font-semibold'>Subtotal: ${sub}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className='mt-3 flex justify-between items-center'>
                      <div className='text-sm text-gray-600'>Total: {getVal(o, 'total', 'amount', 'Total') ? '$' + Number(getVal(o, 'total', 'amount', 'Total')).toFixed(2) : '-'}</div>
                      {/* change the 'Ir al detalle' to toggle the expansion if desired, but keep link if you want external page too */}
                      <div className='flex items-center gap-2'>
                        <Button onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))} className='px-3 py-1'>{isOpen ? 'Ocultar detalle' : 'Ir al detalle'}</Button>
                        {/* Optional: keep link to full page */}
                        {/* <Button onClick={() => navigate(`/admin/orders/${id}`)} className='px-3 py-1'>Ver página</Button> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className='flex justify-center items-center gap-2 mt-3 p-4 flex-wrap'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded'
        >Anterior</button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-3 py-1 rounded ${page === pg ? 'bg-orange-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >{pg}</button>
        ))}

        <button
          disabled={!canNext}
          onClick={() => setPage(page + 1)}
          className='bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded'
        >Siguiente</button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPage(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3 px-2 py-1'
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

export default ListOrdersPage;
