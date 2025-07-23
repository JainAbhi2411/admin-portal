import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ role }) => {
  const [tenants, setTenants] = useState([]);
  const [health, setHealth] = useState([]);
  const [selectedConfigs, setSelectedConfigs] = useState([]);
  const [selectedTenantName, setSelectedTenantName] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchTenants();
    fetchHealth();
  }, []);

  const fetchTenants = async () => {
    const res = await axios.get('https://admin-portal-l8su.onrender.com/tenants');
    setTenants(res.data);
  };

  const fetchHealth = async () => {
    const res = await axios.get('https://admin-portal-l8su.onrender.com/health');
    setHealth(res.data);
  };

  const fetchTenantConfigs = async (tenant) => {
    const res = await axios.get(`https://admin-portal-l8su.onrender.com/tenant/${tenant.id}/configs`);
    setSelectedConfigs(res.data);
    setSelectedTenantName(tenant.name);
  };

  const togglePipeline = async (id, state) => {
    await axios.post(
      `https://admin-portal-l8su.onrender.com/pipeline/${id}/toggle`,
      { pipeline_enabled: !state },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    fetchTenants();
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Admin Dashboard</h2>

      {/* Tenants */}
      <section style={styles.section}>
        <h3 style={styles.subHeading}>🏢 Tenants</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Timezone</th>
                <th>Pipeline</th>
                <th>{role === 'admin' ? 'Actions' : 'View Config'}</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.id} style={styles.row}>
                  <td style={styles.td}>{t.name}</td>
                  <td style={styles.td}>{t.email}</td>
                  <td style={styles.td}>{t.timezone}</td>
                  <td style={{ color: t.pipeline_enabled ? 'green' : 'red', fontWeight: 'bold' }}>
                    {t.pipeline_enabled ? 'Running' : 'Stopped'}
                  </td>
                  <td>
                    {role === "admin" ? (
                      <>
                        <button style={styles.button} onClick={() => togglePipeline(t.id, t.pipeline_enabled)}>
                          {t.pipeline_enabled ? '⛔ Stop' : '▶️ Start'}
                        </button>
                        <button style={styles.button} onClick={() => fetchTenantConfigs(t)}>
                          👁️ View Config
                        </button>
                      </>
                    ) : (
                      <button style={styles.button} onClick={() => fetchTenantConfigs(t)}>👁️ View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Health Snapshot */}
      <section style={styles.section}>
        <h3 style={styles.subHeading}>🩺 System Health Snapshot</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th>Tenant</th>
                <th>Last Sync</th>
                <th>Last Error</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {health.map((h, idx) => (
                <tr key={idx} style={styles.row}>
                  <td style={styles.td} >{h.tenant}</td>
                  <td style={styles.td}>{h.last_sync}</td>
                  <td style={styles.td}>{h.last_error}</td>
                  <td style={{ fontWeight: 'bold', color: getStatusColor(h.status) }}>
                    {h.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Config Table */}
      {selectedConfigs.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.subHeading}>
            🔍 Configurations for <strong>{selectedTenantName}</strong>
          </h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th>Host</th>
                  <th>Port</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {selectedConfigs.map(config => (
                  <tr key={config.id} style={styles.row}>
                    <td style={styles.td}>{config.host}</td>
                    <td style={styles.td}>{config.port}</td>
                    <td style={styles.td}>{config.username}</td>
                    <td style={styles.td}>
                      {role === "admin" ? (
                        <>
                          {visiblePasswords[config.id] ? config.password : '••••••'}
                          <button onClick={() => togglePasswordVisibility(config.id)} style={styles.iconButton}>
                            {visiblePasswords[config.id] ? '🙈' : '👁️'}
                          </button>
                        </>
                      ) : (
                        '••••••'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

// 🌈 Styling
const styles = {
  container: {
    padding: '40px 50px',
    fontFamily: '"Segoe UI", sans-serif',
    backgroundColor: '#f8f9fa',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  heading: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#343a40',
    marginBottom: '30px',
  },
  subHeading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '15px',
    borderBottom: '2px solid #dee2e6',
    paddingBottom: '5px'
  },
  section: {
    marginBottom: '40px',
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '100%',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  thead: {
    backgroundColor: '#212529',
    color: '#ffffff',
    textAlign: 'left',
  },
  row: {
    backgroundColor: '#ffffff',
    color: '#212529',
    transition: 'background-color 0.3s ease',
  },
  td: {
    fontSize: '15px',
    padding: '14px 16px',
    borderBottom: '1px solid #dee2e6',
    textAlign: 'left',
  },
  button: {
    margin: '3px',
    padding: '6px 14px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s',
  },
  iconButton: {
    marginLeft: '10px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: '16px',
    color: '#0d6efd',
  },
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'green': return 'green';
    case 'yellow': return 'orange';
    case 'red': return 'red';
    default: return '#2d3436';
  }
};

export default Dashboard;
