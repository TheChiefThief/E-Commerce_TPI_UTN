import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import Button from './Button';
// ⚠️ Asegúrate de que las rutas sean correctas para tu proyecto
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';
import { useCart } from '../context/CartProvider';

const Header = ({ onSearch }) => {
    const navigate = useNavigate();
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

    const { isAuthenticated, signout, singout } = useAuth();
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

    // COMPONENTE ENVOLTORIO DEL MODAL (similar a la apariencia de tus imágenes)
    const ModalWrapper = ({ children, title }) => (
        // Fondo oscuro que ocupa toda la pantalla
        <div
            className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-[999]"
            onClick={closeModal}
        >
            {/* Contenedor principal del Modal */}
            <div
                // Estilos basados en tus imágenes: un contenedor blanco centrado
                className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()} // Evita que se cierre al hacer click dentro
            >
                {/* Título y botón de cerrar */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                        aria-label="Cerrar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );


    return (
        <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
            <div className="px-4 py-3">

                {/* Mobile Header - Código Original Mantenido */}
                <div className="flex items-center justify-between md:hidden">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">

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
                            className="bg-white p-2 text-gray-500 hover:text-purple-600 transition h-full"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Botón de Menú Móvil */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d={
                                    menuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu - Lógica de Modal Aplicada */}
                {menuOpen && (
                    <div className="md:hidden mt-4 space-y-3 border-t border-gray-200 pt-4">
                        {/* Links de navegación */}
                        <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-800 hover:text-purple-600 font-medium py-2">
                            Productos
                        </Link>
                        <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center text-gray-800 hover:text-purple-600 font-medium py-2">
                            <div className="relative inline-block mr-2">
                                <img src="/cart-fill.svg" alt="Carrito" className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-1.5">{totalItems}</span>
                                )}
                            </div>
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
                                        onClick={() => openModal('login')} // Abrir Modal
                                        className="w-full py-2 px-4 rounded-md font-medium"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button
                                        onClick={() => openModal('signup')} // Abrir Modal
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

                {/* Desktop Header - Código Original Mantenido */}
                <div className="hidden md:flex items-center justify-between">

                    {/* Logo y Links de Navegación */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-2xl font-extrabold text-gray-800 flex items-center">
                            <svg className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 12V4H12V12H4Z" />
                                <path d="M4 20V12H12V20H4Z" opacity="0.7" />
                                <path d="M12 4H20V12H12V4Z" opacity="0.5" />
                                <path d="M12 12H20V20H12V12Z" opacity="0.3" />
                            </svg>
                            <span className="sr-only">E-commerce Logo</span>
                        </Link>
                        <Link to="/" className="text-gray-800 hover:text-purple-600 font-medium">
                            Productos
                        </Link>
                        <Link to="/cart" className="flex items-center text-gray-800 hover:text-purple-600 font-medium">
                            <div className="relative inline-block mr-2">
                                <img src="/cart-fill.svg" alt="Carrito" className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-1.5">{totalItems}</span>
                                )}
                            </div>
                            Carrito de compras
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
                            className="bg-white p-2 text-gray-500 hover:text-purple-600 transition h-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Botones de Autenticación - Lógica de Modal Aplicada */}
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
                                    onClick={() => openModal('login')} // Abrir Modal
                                    className="py-2 px-4 rounded-md font-medium"
                                >
                                    Iniciar Sesión
                                </Button>
                                <Button
                                    onClick={() => openModal('signup')} // Abrir Modal
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

            {/* RENDERIZADO CONDICIONAL DEL MODAL */}
            {authFormType === 'login' && (
                <ModalWrapper title="Iniciar Sesión">
                    {/* Pasamos 'onClose' para que el formulario lo use al iniciar sesión */}
                    <LoginForm
                        onClose={closeModal}
                        openSignup={() => openModal('signup')} // Permite cambiar a Registro
                    />
                </ModalWrapper>
            )}

            {authFormType === 'signup' && (
                <ModalWrapper title="Registrar Usuario">
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