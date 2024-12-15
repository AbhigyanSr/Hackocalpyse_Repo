import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import ResourceTrading from './components/ResourceTrading';
import SurvivalGuide from './components/SurvivalGuide';
import NotFound from './components/NotFound';
import Layout from './components/Layout';
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
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/trade" element={<ResourceTrading />} />
        <Route path="/survival" element={<SurvivalGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
