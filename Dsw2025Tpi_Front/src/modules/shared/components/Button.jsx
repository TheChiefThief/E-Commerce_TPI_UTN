function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-orange-200 hover:bg-orange-300 text-orange-800 transition',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition',
  };

  return (
    <button
      {...restProps}
      className={`${variantStyle[variant]} ${restProps.className}`}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
