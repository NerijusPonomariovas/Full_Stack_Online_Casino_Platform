
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
<<<<<<< HEAD
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Mines from './mines'
=======
>>>>>>> parent of cab7a689 (Add Minesweeper game components and route)

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
