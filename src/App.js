import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import SurvivalGuide from './components/SurvivalGuide';
import NotFound from './components/NotFound';
import Layout from './components/Layout';
import TradingResource from './components/ResourceTrading';
import AvailableResources from './components/AvailableResources';
import TradePage from './components/TradePage';
import './styles/terminal-theme.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout user={user}>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/trade" element={<TradingResource />} />
        <Route path="/survival" element={<SurvivalGuide />} />

        {/* New Routes */}
        <Route path="/trading-resource" element={<TradingResource />} />
        <Route path="/available-resources" element={<AvailableResources />} />
        <Route path="/trade/:resourceId" element={<TradePage />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
