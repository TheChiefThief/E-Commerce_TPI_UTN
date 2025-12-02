import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { singout } = useAuth();

  const logout = () => {
    navigate('/', { replace: true });
    setTimeout(() => singout(), 150);
  };

  const getLinkStyles = ({ isActive }) =>
    `
      block w-full
    pl-2 py-2                 
    rounded-xl               

    text-base                
    transition hover:bg-gray-100

    sm:pl-4 sm:py-4 sm:rounded-2xl sm:text-lg   /* Desktop crece */
    ${isActive ? 'bg-orange-200 hover:bg-orange-100 text-orange-800' : ''}
  `;
    

  const renderLogoutButton = (mobile = false) => (
    <Button
      className={mobile ? 'block w-full sm:hidden' : 'hidden sm:block'}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );

  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        sm:grid-cols-[256px_1fr]
        sm:gap-3
      "
    >

      {/* HEADER */}
      <header
        className="
          flex items-center justify-between
          p-4 bg-white shadow rounded
          sm:col-span-2
        "
      >
        <img
          src="/eCommerceEscaparate.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />

        {/* Logout desktop */}
        {renderLogoutButton()}

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden text-3xl"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? '✕' : '☰'}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0
          w-64 p-6 bg-white shadow rounded
          flex flex-col justify-between
          transition-all duration-300
          z-40
          ${openMenu ? 'translate-x-0' : '-translate-x-64'}

          sm:relative sm:translate-x-0
        `}
      >
        <nav>
          <ul className="flex flex-col">
            <li>
              <NavLink to="/admin/home" className={getLinkStyles}>
                Principal
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={getLinkStyles}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={getLinkStyles}>
                Ordenes
              </NavLink>
            </li>
          </ul>

          <hr className="opacity-20 mt-4" />
        </nav>

        {/* Logout mobile */}
        {renderLogoutButton(true)}
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-5 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
