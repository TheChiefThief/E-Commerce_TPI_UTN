function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const baseStyle = 'py-2 px-4 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyle = {
    default: 'bg-orange-200 hover:bg-orange-300 text-orange-800',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  };

  return (
    <button
      {...restProps}
      className={`
        ${baseStyle} 
        ${variantStyle[variant]} 
        ${restProps.className}
      `}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
