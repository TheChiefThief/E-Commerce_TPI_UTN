import GenericFilters from '../../shared/components/GenericFilters';

function OrderFilters({ search, setSearch, status, onStatusChange, onSearch }) {
  const statusOptions = [
    { value: 'all', label: 'TODAS LAS ORDENES' },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'PROCESSING', label: 'PROCESSING' },
    { value: 'SHIPPED', label: 'SHIPPED' },
    { value: 'DELIVERED', label: 'DELIVERED' },
    { value: 'CANCELLED', label: 'CANCELLED' }
  ];

  return (
    <GenericFilters
      searchTerm={search}
      setSearchTerm={setSearch}
      onSearch={onSearch}
      status={status}
      onStatusChange={onStatusChange}
      statusOptions={statusOptions}
    />
  );
}

export default OrderFilters;
