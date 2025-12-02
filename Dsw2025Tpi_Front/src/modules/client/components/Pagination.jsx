const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" >
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">&lt;</span>
      </button>
      <div className="text-sm text-gray-700">Página {page} / {totalPages}</div>
      <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="hidden sm:inline">Siguiente</span>
        <span className="sm:hidden">&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
