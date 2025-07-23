// src/App.js or App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Config from './pages/Config';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';

const App = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      {token && <Navbar role={role} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        {token ? (
          <>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/config" element={<Config />} />
            {role === "admin" && <Route path="/users" element={<UserManagement />} />}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};


export default App;
