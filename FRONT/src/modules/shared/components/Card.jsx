function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default Card;