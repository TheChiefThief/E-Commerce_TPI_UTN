import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import ClientHome from './modules/home/pages/ClientHome';
import CartPage from './modules/home/pages/CartPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Outlet /></>,
      children: [
        {
          index: true,
          element: <ClientHome />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <RegisterPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'products',
          element: <ListProductsPage />,
        },
        {
          path: 'products/create',
          element: <CreateProductPage />,
        },
        {
          path: 'orders',
          element: <ListOrdersPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;