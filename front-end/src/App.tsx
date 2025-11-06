
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'

import Home from './pages/Home'
import Navbar from './components/Navbar'



function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashBoard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
