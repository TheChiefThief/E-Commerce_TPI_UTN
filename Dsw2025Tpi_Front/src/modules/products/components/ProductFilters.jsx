import GenericFilters from '../../shared/components/GenericFilters';
import { productStatus } from '../helpers/productHelpers';

function ProductFilters({
  searchTerm,
  setSearchTerm,
  status,
  setStatus,
  onSearch,
  onCreateProduct
}) {
  const statusOptions = [
    { value: productStatus.ALL, label: 'Todos' },
    { value: productStatus.ENABLED, label: 'Habilitados' },
    { value: productStatus.DISABLED, label: 'Inhabilitados' }
  ];

  return (
    <GenericFilters
      title="Productos"
      onCreate={onCreateProduct}
      createLabel="Crear Producto"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onSearch={onSearch}
      status={status}
      setStatus={setStatus}
      statusOptions={statusOptions}
    />
  );
}

export default ProductFilters;

