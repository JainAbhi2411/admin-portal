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
      {token ? (
        <>
          <Navbar role={role} />
          <div style={styles.pageContainer}>
            <Routes>
              <Route path="/" element={<Dashboard role={role} />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/config" element={<Config />} />
              {role === "admin" && <Route path="/users" element={<UserManagement />} />}
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

const styles = {
  pageContainer: {
    marginTop: '60px',       // Height of your fixed navbar
    padding: '0',
    width: '100vw',
    minHeight: 'calc(100vh - 60px)',
    overflowX: 'hidden',
    backgroundColor: '#f1f2f6',
  }
};

export default App;
