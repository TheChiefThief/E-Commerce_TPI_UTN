import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Cart from './Pages/Cart.jsx'
import Header from './Components/Header.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import { CartProvider } from './Context/NewCartContext.jsx';
import ProtectedRoute from './Components/Common/ProtectedRoute.jsx';
import NotFound from './Pages/NotFound.jsx';
import Layout from './Components/Layout.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import ProductListAdmin from './Pages/Admin/ProductListAdmin.jsx';
import ProductCreate from './Pages/Admin/ProductCreate.jsx';
import OrderListAdmin from './Pages/Admin/OrderListAdmin.jsx';
import './App.css'



function App() {
  return(
    <Router>
      <AuthProvider>
        <CartProvider>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/orders/success' element={<Layout><h1>Orden Exitosa</h1></Layout>} />
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path ='/admin' element={<Layout>
                  <AdminDashboard />
                </Layout>}/>
                <Route path ='/admin/products' element={<Layout>
                  <ProductListAdmin />
                </Layout>}/>
                <Route path ='/admin/products/create' element={<Layout>
                  <ProductCreate/>
                </Layout>}/>
                <Route path ='/admin/orders' element={<Layout>
                  <OrderListAdmin/>
                </Layout>}/>
              </Route>
              <Route path = '*' element={<Layout><NotFound/></Layout>}/>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
