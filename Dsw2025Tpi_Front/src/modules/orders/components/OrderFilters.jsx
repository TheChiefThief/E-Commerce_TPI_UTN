import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar';

function OrderFilters({ search, setSearch, status, onStatusChange, onSearch }) {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <div className='flex items-center gap-3 w-full sm:w-auto'>
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={onSearch}
          className='w-full sm:w-64'
        />
      </div>
      <select
        value={status}
        onChange={onStatusChange}
        className='p-2 border border-gray-300 rounded-lg text-base'
      >
        <option value='all'>TODAS LAS ORDENES</option>
        <option value='PENDING'>PENDING</option>
        <option value='PROCESSING'>PROCESSING</option>
        <option value='SHIPPED'>SHIPPED</option>
        <option value='DELIVERED'>DELIVERED</option>
        <option value='CANCELLED'>CANCELLED</option>
      </select>
    </div>
  );
}

export default OrderFilters;
