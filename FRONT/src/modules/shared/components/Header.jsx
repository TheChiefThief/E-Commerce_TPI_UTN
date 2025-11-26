// src/shared/components/ClientHeader.jsx


import { Link, useNavigate } from 'react-router-dom';
import Button from './Button'; // Utiliza tu componente Button

const Header = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    if (onSearch) {
      onSearch(query);
    }
  };
  
  // Simulación de logueo (usarías tu contexto de autenticación real)
  const isAuthenticated = !!localStorage.getItem('userToken');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('customerId');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo y Navegación Izquierda */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
            {/* Logo de la imagen del TPI */}
            <svg className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 12V4H12V12H4Z" fill="currentColor"/><path d="M4 20V12H12V20H4Z" fill="currentColor" opacity="0.7"/><path d="M12 4H20V12H12V4Z" fill="currentColor" opacity="0.5"/><path d="M12 12H20V20H12V12Z" fill="currentColor" opacity="0.3"/></svg>
            <span className='sr-only'>E-commerce Logo</span>
          </Link>
          
          <Link to="/" className="text-gray-800 hover:text-purple-600 font-medium">
            Productos
          </Link>
          <Link to="/cart" className="text-gray-800 hover:text-purple-600 font-medium">
            Carrito de compras
          </Link>
        </div>
        
        {/* Barra de Búsqueda (Centro) */}
        <form onSubmit={handleSearch} className="flex items-center flex-grow mx-10 max-w-lg border rounded-lg overflow-hidden h-10">
          <input 
            type="text" 
            name="search"
            placeholder="Search" 
            className="w-full p-2 outline-none text-gray-700 text-sm"
          />
          <button 
            type="submit" 
            className="bg-white p-2 text-gray-500 hover:text-purple-600 transition h-full"
          >
            {/* Icono de búsqueda Q */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </form>

        {/* Botones de Autenticación (Derecha) */}
        <div className="flex space-x-3">
          {isAuthenticated ? (
            <Button 
                onClick={handleLogout} 
                variant="secondary"
                className="py-2 px-4 rounded-md font-medium"
            >
                Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/login')} 
                className="py-2 px-4 rounded-md font-medium"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate('/signup')} 
                variant="secondary"
                className="py-2 px-4 rounded-md font-medium"
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;