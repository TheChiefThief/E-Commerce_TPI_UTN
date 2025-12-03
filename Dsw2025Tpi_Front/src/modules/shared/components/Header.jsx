import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import Button from './Button';
// ⚠️ Asegúrate de que las rutas sean correctas para tu proyecto
import LoginForm from '../../auth/components/LoginForm';
import ModalWrapper from '../components/ModalWrapper';
import RegisterForm from '../../auth/components/RegisterForm';
import { useCart } from '../context/CartProvider';

const Header = ({ onSearch }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // ESTADO: Controla qué formulario se muestra ('login', 'signup', o null/cerrado)
    const [authFormType, setAuthFormType] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.elements.search.value;
        if (onSearch) {
            onSearch(query);
        }
    };

    const { isAuthenticated, signout, singout, userName } = useAuth();
    const { totalItems } = useCart();

    const handleLogout = () => {
        // Navigate to the public home page first, then clear auth tokens
        // Use replace to avoid going back to a protected page in history
        navigate('/', { replace: true });
        // call provider signout (supports both names); delay slightly to avoid protected route redirect
        setTimeout(() => {
            if (typeof signout === 'function') signout();
            if (typeof singout === 'function') singout();
        }, 150);
        // also clear any legacy keys
        try { localStorage.removeItem('userToken'); } catch (e) { }
        try { localStorage.removeItem('customerId'); } catch (e) { }
        setMenuOpen(false);
    };

    // FUNCIÓN PARA CERRAR EL MODAL
    const closeModal = () => {
        setAuthFormType(null);
    }

    // FUNCIÓN PARA ABRIR EL MODAL (y cerrar el menú móvil)
    const openModal = (type) => {
        setAuthFormType(type);
        setMenuOpen(false);
    }

    // Helper to check active path
    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
            <div className="px-4 py-3">

                {/* Mobile Header */}
                <div className="flex items-center justify-between md:hidden">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
                        <img src="/LogoEcommerce.png" alt="Logo" className="h-12 w-auto" />
                        <span className="sr-only">E-commerce Logo</span>
                    </Link>

                    {/* Barra de Búsqueda */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center flex-1 mx-3 border border-gray-300 rounded-lg h-9 overflow-hidden"
                    >
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            className="w-full p-2 outline-none text-gray-700 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-white p-2 text-gray-500 hover:text-orange-600 transition h-full"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Botón de Menú Móvil */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="ml-2 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Sidebar (Drawer) */}
                {menuOpen && (
                    <div className="fixed inset-0 z-[60] flex md:hidden">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 backdrop-blur-md bg-black/5 transition-opacity"
                            onClick={() => setMenuOpen(false)}
                        ></div>

                        {/* Sidebar Panel */}
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
                                    <img src="/eCommerceEscaparate.png" alt="Logo" className="h-8 w-auto" />
                                </Link>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                                <Link
                                    to="/"
                                    onClick={() => setMenuOpen(false)}
                                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive('/')
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                >
                                    Productos
                                </Link>
                                <Link
                                    to="/cart"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive('/cart')
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                >
                                    <span>Carrito de compras</span>
                                    {totalItems > 0 && (
                                        <span className={`py-0.5 px-2 rounded-full text-xs font-bold ${isActive('/cart')
                                            ? 'bg-orange-200 text-orange-800'
                                            : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <div className="border-t border-gray-100 my-2 pt-2"></div>

                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center px-4 py-3 mb-2 bg-orange-100 rounded-lg mx-2">
                                            <div className="p-1.5 bg-white rounded-full text-orange-500 mr-3 shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-orange-900 truncate text-sm">{userName || 'Usuario'}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => openModal('login')}
                                            className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            Iniciar Sesión
                                        </button>
                                        <button
                                            onClick={() => openModal('signup')}
                                            className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            Registrarse
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between">

                    {/* Logo y Links de Navegación */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
                            <img src="/LogoNombre.png" alt="Logo" className="h-20 w-auto mr-2" />
                            <span className="sr-only">E-commerce Logo</span>
                        </Link>
                        <Link to="/" className="text-base text-gray-800 hover:text-orange-600 font-medium">
                            Productos
                        </Link>
                    </div>

                    {/* Barra de Búsqueda Central */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center flex-1 mx-8 max-w-lg border border-gray-300 rounded-lg h-10 overflow-hidden"
                    >
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            className="w-full p-2 outline-none text-gray-700 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-white p-2 text-gray-500 hover:text-orange-600 transition h-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Botones de Autenticación */}
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="flex items-center text-base text-gray-800 hover:text-orange-600 font-medium">
                            <div className="relative inline-block mr-2">
                                <img src="/cart-outline.svg" alt="Carrito" className="w-8 h-8" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full px-1.5">{totalItems}</span>
                                )}
                            </div>
                            Carrito de compras
                        </Link>

                        <div className="flex space-x-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center px-3 py-1.5 bg-orange-100 rounded-full">
                                        <div className="p-1 bg-white rounded-full text-orange-500 mr-2 shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-orange-900 text-sm max-w-[150px] truncate">{userName || 'Usuario'}</span>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="secondary"
                                        className="py-2 px-4 rounded-md font-medium text-sm"
                                    >
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => openModal('login')} // Abrir Modal
                                        className="py-2 px-4 rounded-md font-medium text-sm"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button
                                        onClick={() => openModal('signup')} // Abrir Modal
                                        variant="secondary"
                                        className="py-2 px-4 rounded-md font-medium text-sm"
                                    >
                                        Registrarse
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RENDERIZADO CONDICIONAL DEL MODAL */}
            {authFormType === 'login' && (
                <ModalWrapper title="Iniciar Sesión" onClose={closeModal}>
                    {/* Pasamos 'onClose' para que el formulario lo use al iniciar sesión */}
                    <LoginForm
                        onClose={closeModal}
                        openSignup={() => openModal('signup')} // Permite cambiar a Registro
                    />
                </ModalWrapper>
            )}

            {authFormType === 'signup' && (
                <ModalWrapper title="Registrar Usuario" onClose={closeModal}>
                    {/* Pasamos 'onClose' para que el formulario lo use al registrarse */}
                    <RegisterForm
                        onClose={closeModal}
                        openLogin={() => openModal('login')} // Permite cambiar a Login
                    />
                </ModalWrapper>
            )}

        </header>
    );
};

export default Header;