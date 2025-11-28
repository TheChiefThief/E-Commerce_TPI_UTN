import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from './Button'; // Utiliza tu componente Button

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 py-3">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden">
          <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 12V4H12V12H4Z" fill="currentColor"/><path d="M4 20V12H12V20H4Z" fill="currentColor" opacity="0.7"/><path d="M12 4H20V12H12V4Z" fill="currentColor" opacity="0.5"/><path d="M12 12H20V20H12V12Z" fill="currentColor" opacity="0.3"/></svg>
            <span className='sr-only'>E-commerce Logo</span>
          </Link>

          <form onSubmit={handleSearch} className="flex items-center flex-1 mx-3 border border-gray-300 rounded-lg h-9 overflow-hidden">
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 border-t border-gray-200 pt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-800 hover:text-purple-600 font-medium py-2">
              Productos
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block text-gray-800 hover:text-purple-600 font-medium py-2">
              Carrito de compras
            </Link>
            <div className="border-t border-gray-200 pt-3 space-y-2">
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout} 
                  variant="secondary"
                  className="w-full py-2 px-4 rounded-md font-medium"
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => { navigate('/login'); setMenuOpen(false); }}
                    className="w-full py-2 px-4 rounded-md font-medium"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    onClick={() => { navigate('/signup'); setMenuOpen(false); }}
                    variant="secondary"
                    className="w-full py-2 px-4 rounded-md font-medium"
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
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
          
          <form onSubmit={handleSearch} className="flex items-center flex-1 mx-8 max-w-lg border border-gray-300 rounded-lg h-10 overflow-hidden">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>

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
      </div>
    </header>
  );
};

export default Header;