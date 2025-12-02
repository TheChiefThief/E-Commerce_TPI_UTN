function ProductPagination({ 
  pageNumber, 
  totalPages, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) {
  return (
    <div className='flex justify-center items-center gap-2 mt-4 p-4 flex-wrap'>
      <button
        disabled={pageNumber === 1}
        onClick={() => onPageChange(pageNumber - 1)}
        className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded'
      >
        Anterior
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-orange-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={pageNumber === totalPages}
        onClick={() => onPageChange(pageNumber + 1)}
        className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded'
      >
        Siguiente
      </button>

      <select
        value={pageSize}
        onChange={evt => onPageSizeChange(Number(evt.target.value))}
        className='ml-3 px-2 py-1 border border-gray-300 rounded-lg'
      >
        <option value="2">2</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  );
}

export default ProductPagination;
