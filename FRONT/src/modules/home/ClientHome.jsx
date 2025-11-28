import React, { useEffect, useState } from 'react';
import ClientHeader from '../../../modules/shared/components/Header';
import Card from '../../shared/components/Card';
// Usar el servicio correcto para productos
import { getProducts } from '../../products/services/list';

// Datos simulados para demostrar el layout si la API falla
const mockProducts = [
  { id: '1', sku: 'ABC101', name: "Producto A", currentUnitPrice: 19.99, stockQuantity: 50, isActive: true },
  { id: '2', sku: 'ABC102', name: "Producto B", currentUnitPrice: 29.99, stockQuantity: 30, isActive: true },
  { id: '3', sku: 'ABC103', name: "Producto C", currentUnitPrice: 5.50, stockQuantity: 10, isActive: true },
  { id: '4', sku: 'ABC104', name: "Producto D", currentUnitPrice: 49.00, stockQuantity: 5, isActive: true },
  { id: '5', sku: 'ABC105', name: "Producto E", currentUnitPrice: 12.75, stockQuantity: 20, isActive: true },
  { id: '6', sku: 'ABC106', name: "Producto F", currentUnitPrice: 7.99, stockQuantity: 15, isActive: true },
  { id: '7', sku: 'ABC107', name: "Producto G", currentUnitPrice: 3.50, stockQuantity: 40, isActive: true },
  { id: '8', sku: 'ABC108', name: "Producto H", currentUnitPrice: 99.99, stockQuantity: 2, isActive: true },
];

function ClientHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8); 
  
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // NOTA: Para el cliente, solo pedimos productos ACTIVOS ('active')
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // La API /api/products soporta paginación y búsqueda
      const { data } = await getProducts(searchTerm, 'active', pageNumber, pageSize); 
      
      // Adaptar la respuesta del backend (asumiendo que devuelve una lista)
      setTotal(data.total ?? data.totalCount ?? 0);
      // Filtramos la data o usamos mock data si la API devuelve un array vacío
      setProducts(data.productItems ?? data.products ?? mockProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize));
      
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback para usar mock data si la API falla
      setProducts(mockProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize));
      setTotal(mockProducts.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize]); // Llama al recargar página/tamaño

  const handleSearch = (query) => {
    setSearchTerm(query);
    setPageNumber(1); 
    fetchProducts(); // Llamar a la API con el nuevo término de búsqueda
  };
  
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Header del Cliente (con búsqueda, carrito, login) */}
      <ClientHeader onSearch={handleSearch} /> 
      
      <main className="container mx-auto px-4 py-8">
        
        {loading ? (
            <span className='text-center block text-lg text-gray-600'>Cargando productos...</span>
        ) : (
          /* 2. Grilla de Productos (Listado de Productos) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {product.sku ?? product.id}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-purple-700">${(product.currentUnitPrice ?? product.price ?? 0).toFixed(2)}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stockQuantity ?? product.stock ?? 0}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* 3. Paginación */}
        {total > pageSize && (
            <div className='flex justify-center items-center mt-8 space-x-4'>
              <button
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className='bg-purple-200 text-purple-700 disabled:bg-gray-200 disabled:text-gray-500 py-2 px-4 rounded-md transition duration-150'
              >
                ← Previous
              </button>
              
              <span className='font-medium text-gray-700'>
                Página {pageNumber} de {totalPages}
              </span>
              
              <button
                disabled={ pageNumber === totalPages }
                onClick={() => setPageNumber(pageNumber + 1)}
                className='bg-purple-200 text-purple-700 disabled:bg-gray-200 disabled:text-gray-500 py-2 px-4 rounded-md transition duration-150'
              >
                Next →
              </button>
            </div>
        )}
      </main>
    </div>
  );
}

export default ClientHome;