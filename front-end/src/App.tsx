
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Mines from './mines'

function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashBoard" element={<Dashboard/>}/>
         <Route path="/mines" element={<Mines />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
