function Pagination({ 
  page,
  pageNumber,
  totalPages,
  pageSize,
  canNext,
  setPage,
  onPageChange,
  onPageSizeChange,
  showPageNumbers = true,
  showPageSize = true
}) {
  // Normalizar props para soportar ambas APIs
  const currentPage = page || pageNumber || 1;
  const handlePageChange = setPage || onPageChange || (() => {});

  const goToPrevious = () => {
    if (currentPage > 1) {
      if (setPage) {
        setPage(p => Math.max(1, p - 1));
      } else {
        handlePageChange(currentPage - 1);
      }
    }
  };

  const goToNext = () => {
    const canGoNext = canNext !== undefined ? canNext : currentPage < totalPages;
    if (canGoNext) {
      if (setPage) {
        setPage(p => p + 1);
      } else {
        handlePageChange(currentPage + 1);
      }
    }
  };

  const goToPage = (pageNum) => {
    if (setPage) {
      setPage(pageNum);
    } else {
      handlePageChange(pageNum);
    }
  };

  return (
    <div className='flex justify-center items-center gap-2 mt-4 p-4 flex-wrap'>
      <button
        disabled={currentPage === 1}
        onClick={goToPrevious}
        className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300'
      >
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">&lt;</span>
      </button>

      {showPageNumbers ? (
        <>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-orange-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {pageNum}
            </button>
          ))}
          {totalPages > 10 && <span className="text-gray-500">...</span>}
        </>
      ) : (
        <div className="text-sm text-gray-700">
          Página {currentPage} / {totalPages}
        </div>
      )}

      <button
        disabled={canNext !== undefined ? !canNext : currentPage >= totalPages}
        onClick={goToNext}
        className='bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300'
      >
        <span className="hidden sm:inline">Siguiente</span>
        <span className="sm:hidden">&gt;</span>
      </button>

      {showPageSize && onPageSizeChange && pageSize && (
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
      )}
    </div>
  );
}

export default Pagination;
