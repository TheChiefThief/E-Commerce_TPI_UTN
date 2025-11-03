import './App.css'
import './Pages/Home/Home.jsx'
import './Pages/Login/Login.jsx'
import './Pages/Register/Register.jsx'
import './Pages/Cart/Cart.jsx'



function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </Router>
  )
}

export default App
