
import './App.css'
import { Route, Routes,Router, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import Mines from './mines'

function App() {
  <>
    <div>jakub</div>
  </>
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashBoard" element={<Dashboard/>}/>
         <Route path="/mines" element={<Mines />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
