import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>🏠 Dashboard</Link>
        {role === 'admin' && <Link to="/onboarding">🆕 Onboarding</Link>}
{role === 'admin' && <Link to="/config">⚙️ Config</Link>}

        {role === 'admin' && (
          <Link to="/users" style={styles.link}>👤 Users</Link>
        )}
      </div>
      <button onClick={handleLogout} style={styles.logout}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '10px 20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  links: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  logout: {
    padding: '5px 50px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft:'35px'
  },
};

export default Navbar;
