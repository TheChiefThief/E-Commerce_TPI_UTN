import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProducts } from '../../products/services/list';
import { listOrders } from '../../orders/services/listServices';
import { getVal, parseNumber } from '../../orders/helpers/orderHelpers';

function Home() {
  const [prodCount, setProdCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCounts = async () => {
      setLoading(true);
      try {
        // Use existing services. They return { data, error }.
        const [prodRes, orderRes] = await Promise.all([
          getProducts(null, null, 1, 10000), // try to fetch many items so we can count
          listOrders(),
        ]);

        if (!mounted) return;

        // Products count (service may return array or object)
        let pCount = 0;
        if (prodRes && prodRes.data) {
          const d = prodRes.data;
          if (Array.isArray(d)) pCount = d.length;
          else if (d.productItems && Array.isArray(d.productItems)) pCount = d.productItems.length;
          else if (d.products && Array.isArray(d.products)) pCount = d.products.length;
          else if (d.items && Array.isArray(d.items)) pCount = d.items.length;
          else if (d.data && Array.isArray(d.data)) pCount = d.data.length;
          else pCount = 0;
        }
        setProdCount(pCount);

        // Orders count (service returns { data, error })
        let oCount = null;
        let revenue = 0;
        let pending = 0;
        let delivered = 0;
        
        if (orderRes) {
          if (orderRes.error) {
            console.warn('No se pudo obtener ordenes:', orderRes.error);
            oCount = null;
          } else if (orderRes.data) {
            const d = orderRes.data;
            let orders = [];
            
            if (Array.isArray(d)) {
              orders = d;
              oCount = d.length;
            } else if (d.items && Array.isArray(d.items)) {
              orders = d.items;
              oCount = d.items.length;
            } else {
              orders = [d];
              oCount = 1;
            }

            // Calcular estadísticas de las órdenes
            orders.forEach(order => {
              const status = getVal(order, 'status', 'Status')?.toLowerCase() || '';
              
              // Calcular total de la orden
              const orderTotal = (() => {
                const t = getVal(order, 'total', 'amount', 'Total', 'totalAmount', 'grandTotal', 'totalPrice', 'price', 'orderTotal');
                if (t !== undefined && t !== null && String(t).trim() !== '') 
                  return Number(t || 0);
                
                const items = getVal(order, 'orderItems') || [];
                const computed = items.reduce((s, it) => {
                  const qty = Number(it?.quantity ?? it?.qty ?? 0) || 0;
                  const price = parseNumber(it?.product?.currentUnitPrice ?? it?.price ?? it?.unitPrice ?? 0) || 0;
                  return s + (qty * price);
                }, 0);
                return computed;
              })();

              revenue += orderTotal;

              // Contar por estado
              if (status === 'pending' || status === 'pendiente') {
                pending++;
              } else if (status === 'delivered' || status === 'entregada') {
                delivered++;
              }
            });
          }
        }
        setOrderCount(oCount);
        setTotalRevenue(revenue);
        setPendingOrders(pending);
        setDeliveredOrders(delivered);
      } catch (err) {
        console.error('Error cargando counts:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCounts();

    return () => { mounted = false; };
  }, []);

  return (
    <div className='space-y-6'>
      {/* Estadísticas principales */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm text-gray-600 font-medium'>Total Recaudado</span>
            <span className='text-3xl font-bold text-green-600 mt-2'>
              {loading ? '...' : `$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm text-gray-600 font-medium'>Total Órdenes</span>
            <span className='text-3xl font-bold text-blue-600 mt-2'>
              {loading ? '...' : (orderCount !== null ? orderCount : 'N/A')}
            </span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm text-gray-600 font-medium'>Órdenes Pendientes</span>
            <span className='text-3xl font-bold text-orange-600 mt-2'>
              {loading ? '...' : pendingOrders}
            </span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm text-gray-600 font-medium'>Órdenes Entregadas</span>
            <span className='text-3xl font-bold text-purple-600 mt-2'>
              {loading ? '...' : deliveredOrders}
            </span>
          </div>
        </Card>
      </div>

      {/* Información adicional */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-3'>Productos</h3>
          <p className='text-gray-600'>
            Total de productos: <span className='font-bold text-gray-900'>{loading ? 'Cargando...' : (prodCount !== null ? prodCount : '#')}</span>
          </p>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-3'>Resumen</h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex justify-between'>
              <span>Promedio por orden:</span>
              <span className='font-bold text-gray-900'>
                {loading || !orderCount ? '-' : `$${(totalRevenue / orderCount).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Tasa de entrega:</span>
              <span className='font-bold text-gray-900'>
                {loading || !orderCount ? '-' : `${((deliveredOrders / orderCount) * 100).toFixed(1)}%`}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
