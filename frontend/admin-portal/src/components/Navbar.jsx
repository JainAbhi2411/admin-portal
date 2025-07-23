import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ role }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/onboarding', label: 'Onboarding', icon: '🆕', adminOnly: true },
    { to: '/config', label: 'Config', icon: '⚙️', adminOnly: true },
    { to: '/users', label: 'Users', icon: '👤', adminOnly: true },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <span style={styles.logo}>🚀 MyApp</span>
        <div style={styles.links}>
          {navItems.map(({ to, label, icon, adminOnly }) => {
            if (adminOnly && role !== 'admin') return null;
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                }}
              >
                <span style={styles.icon}>{icon}</span> {label}
              </Link>
            );
          })}
        </div>
      </div>
      <button onClick={handleLogout} style={styles.logout}>
        🔓 Logout
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
  position: 'fixed',
  top: 0,
  width: '100%',             // ✅ Make sure this exists
  backgroundColor: '#ffffff',
  padding: '10px 20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
},
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3498db',
  },
  links: {
    display: 'flex',
    gap: '18px',
  },
  link: {
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '15px',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  activeLink: {
    backgroundColor: '#3498db',
    color: '#ffffff',
  },
  icon: {
    marginRight: '6px',
  },
  logout: {
    display: 'flex',
    alignItems: 'center',
    
    padding: '10px 60px',
    backgroundColor: '#e74c3c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  logoutIcon: {
    fontSize: '16px',
  },
};

export default Navbar;
