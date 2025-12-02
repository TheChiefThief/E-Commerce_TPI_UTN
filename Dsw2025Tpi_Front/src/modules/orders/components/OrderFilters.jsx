import Button from '../../shared/components/Button';

function OrderFilters({ search, setSearch, status, onStatusChange, onSearch }) {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <div className='flex items-center gap-3'>
        <input
          placeholder='Buscar'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='p-2 border border-gray-300 rounded-lg text-base w-full sm:w-64'
        />
        <Button className='h-11 w-11 p-0 flex items-center justify-center' onClick={onSearch}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </Button>
      </div>
      <select 
        value={status} 
        onChange={onStatusChange} 
        className='p-2 border border-gray-300 rounded-lg text-base'
      >
        <option value='all'>Estado de Orden</option>
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
