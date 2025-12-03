import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar';
import { productStatus } from '../helpers/productHelpers';

function ProductFilters({
  searchTerm,
  setSearchTerm,
  status,
  setStatus,
  onSearch,
  onCreateProduct
}) {
  return (
    <>
      <div className='flex justify-between items-center mb-3'>
        <h1 className='text-2xl sm:text-3xl font-bold'>Productos</h1>
        <Button
          onClick={onCreateProduct}
          className='h-11 w-11 rounded-2xl sm:hidden'
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path>
              <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path>
            </g>
          </svg>
        </Button>

        <Button
          className='hidden sm:block'
          onClick={onCreateProduct}
        >
          Crear Producto
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={onSearch}
            className='w-full sm:w-64'
          />
        </div>
        <select
          value={status}
          onChange={evt => setStatus(evt.target.value)}
          className='text-base p-2 border border-gray-300 rounded-lg'
        >
          <option value={productStatus.ALL}>Todos</option>
          <option value={productStatus.ENABLED}>Habilitados</option>
          <option value={productStatus.DISABLED}>Inhabilitados</option>
        </select>
      </div>
    </>
  );
}

export default ProductFilters;
