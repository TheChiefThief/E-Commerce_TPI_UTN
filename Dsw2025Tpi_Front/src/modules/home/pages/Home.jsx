import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProducts } from '../../products/services/list';
import { listOrders } from '../../orders/services/listServices';

function Home() {
  const [prodCount, setProdCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
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
        if (orderRes) {
          if (orderRes.error) {
            console.warn('No se pudo obtener ordenes:', orderRes.error);
            oCount = null;
          } else if (orderRes.data) {
            const d = orderRes.data;
            if (Array.isArray(d)) oCount = d.length;
            else if (d.items && Array.isArray(d.items)) oCount = d.items.length;
            else oCount = 1; // fallback: single object
          }
        }
        setOrderCount(oCount);
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
    <div
      className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
    >
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {loading ? 'Cargando...' : (prodCount !== null ? prodCount : '#')}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: {loading ? 'Cargando...' : (orderCount !== null ? orderCount : 'Sin acceso')}</p>
      </Card>
    </div>
  );
};

export default Home;
