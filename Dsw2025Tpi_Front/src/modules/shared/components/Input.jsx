function Input({ label, error = '', ...restProps }) {
  return (
    <div className='flex flex-col gap-1'>
      {label && <label className="text-sm sm:text-base font-medium text-gray-700">{label}:</label>}
      <input 
        className={`
          w-full p-2 border rounded-lg text-base 
          ${error ? 'border-red-400' : 'border-gray-300'}
        `} 
        {...restProps} 
      />
      {/* Contenedor para el mensaje de error para evitar que el layout salte */}
      <div className="h-4">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
};

export default Input;
