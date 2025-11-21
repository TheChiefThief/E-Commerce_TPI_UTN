import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Cart from './Pages/Cart.jsx'
import Header from './Components/Header.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import { CartProvider } from './Context/NewCartContext.jsx';
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
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
