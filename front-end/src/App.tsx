import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { lazy, Suspense } from "react";

const Cat = lazy(() => import("./pages/games/catGame/Cat.tsx"));


function App() {
  return (
    <BrowserRouter>
     <Navbar />
     <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashBoard" element={<Dashboard/>}/>
          <Route path="/games/cat" element={<Cat/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
