import React, { useState } from 'react';
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./layout/AppLayout";
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/Home'
import BlackJack from './pages/Blackjack'
import Games from './pages/Games';
import Promotions from './pages/promotion';
import Wallet from './pages/wallet';
import Navbar from './components/Navbar'; // Adjust the path accordingly

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games/meow-jack" element={<BlackJack />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;