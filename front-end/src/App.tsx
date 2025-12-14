
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./layout/AppLayout";
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/Home'
import BlackJack from './pages/blackjack'
import Games from './pages/Games';
import Promotions from './pages/promotion';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games/meow-jack" element={<BlackJack />} />
          <Route path="/promotions" element={<Promotions />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
