import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
//import SearchBar from '../common/SearchBar'; // Asumimos un componente de búsqueda simple

const Header = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const { cartItems } = useCart();
    
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Determina la URL del dashboard o panel de usuario
    const dashboardUrl = userRole === 'Administrador' ? '/admin' : '/orders'; // Asumiendo que el cliente tiene una ruta para sus órdenes

    return (
        <header className="main-header">
            <div className="header-content">
                {/* Logo/Título (Fuente: TPI Página 1) */}
                <Link to="/" className="app-logo">
                    DSW 2025 - E-commerce
                </Link>

                <div className="search-area">
                    {/* El input de búsqueda de la Home se maneja dentro de HomePage,
                        pero aquí podemos tener una barra global si fuera necesario. 
                        Para la Home, mantenemos la barra en HomePage.jsx */}
                </div>

                <nav className="header-nav">
                    [cite_start]{/* Botón de Carrito (Visible para todos los visitantes) [cite: 154-156] */}
                    <Link to="/cart" className="nav-cart">
                        ({cartItemCount})
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {/* Enlace al Dashboard/Órdenes si está logeado */}
                            <Link to={dashboardUrl} className="nav-link">
                                {userRole === 'Administrador' ? 'Admin' : 'Mis Órdenes'}
                            </Link>
                            
                            {/* Botón de Cerrar Sesión */}
                            <button onClick={logout} className="nav-button">
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Enlaces de Autenticación */}
                            <Link to="/login" className="nav-link">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="nav-button primary">
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;