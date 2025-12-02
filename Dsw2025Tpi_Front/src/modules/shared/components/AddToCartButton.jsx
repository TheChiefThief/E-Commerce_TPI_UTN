import React from 'react';

const AddToCartButton = ({ price, onClick, disabled = false, className = '' }) => {
  return (
    <div className="add-to-cart-wrapper">
      <div 
        className={`button ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} 
        onClick={!disabled ? onClick : undefined}
        role="button" 
        tabIndex={!disabled ? "0" : "-1"}  
        aria-disabled={disabled}
        onKeyPress={(e) => { if (e.key === 'Enter' && !disabled) onClick(e); }} 
      >
        <div className="button-wrapper">
          <div className="text">Agregar al Carrito</div>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-cart2" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default AddToCartButton;
