import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ role }) => {
  const [tenants, setTenants] = useState([]);
  const [health, setHealth] = useState([]);
  const [selectedConfigs, setSelectedConfigs] = useState([]);
  const [selectedTenantName, setSelectedTenantName] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchTenants();
    fetchHealth();
  }, []);

  const fetchTenants = async () => {
    const res = await axios.get('http://localhost:8000/tenants');
    setTenants(res.data);
  };

  const fetchHealth = async () => {
    const res = await axios.get('http://localhost:8000/health');
    setHealth(res.data);
  };
  const fetchTenantConfigs = async (tenant) => {
  const res = await axios.get(`http://localhost:8000/tenant/${tenant.id}/configs`);
  setSelectedConfigs(res.data);
  setSelectedTenantName(tenant.name);
};
const togglePasswordVisibility = (id) => {
  setVisiblePasswords(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};
  const togglePipeline = async (id, state) => {
    await axios.post(`http://localhost:8000/pipeline/${id}/toggle`, {
      pipeline_enabled: !state,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchTenants();
  };
  console.log(selectedConfigs);

  return (
    <div style={{ padding: '80px 20px' }}> {/* accounts for sticky navbar */}
      <h2>📊 Admin Dashboard</h2>

      {/* Tenants Table */}
      <div style={{ marginBottom: "30px" }}>
        <h3>🏢 Tenants</h3>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
          <thead style={{ backgroundColor:' #534f4fff' }}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Timezone</th>
              <th>Pipeline</th>
              {role === "admin" && <th>Toggle</th>}
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.timezone}</td>
                <td style={{ color: t.pipeline_enabled ? 'green' : 'red', fontWeight: 'bold' }}>
                  {t.pipeline_enabled ? 'Running' : 'Stopped'}
                </td>
                {role === "admin" && (
                  <td>
                    <button onClick={() => togglePipeline(t.id, t.pipeline_enabled)}>
                      {t.pipeline_enabled ? 'Stop' : 'Start'}
                    </button>
                    <button onClick={() => fetchTenantConfigs(t)} style={{ marginLeft: '10px' }}>
                      👁️ View Config
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Health */}
      <div>
        <h3>🩺 System Health Snapshot</h3>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#534f4fff' }}>
            <tr>
              <th>Tenant</th>
              <th>Last Sync</th>
              <th>Last Error</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {health.map((h, idx) => (
              <tr key={idx}>
                <td>{h.tenant}</td>
                <td>{h.last_sync}</td>
                <td>{h.last_error}</td>
                <td>
                  <span style={{
                    color: h.status === 'green' ? 'green' :
                          h.status === 'yellow' ? 'orange' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {h.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedConfigs.length > 0 && (
  <div style={{ marginTop: "40px" }}>
    <h3>🔍 Configurations for <strong>{selectedTenantName}</strong></h3>
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
      <thead style={{ backgroundColor: '#534f4fff' }}>
        <tr>
          <th>Host</th>
          <th>Port</th>
          <th>Username</th>
          <th>Password</th>
        </tr>
      </thead>
      <tbody>
        {selectedConfigs.map(config => (
          <tr key={config.id}>
            <td>{config.host}</td>
            <td>{config.port}</td>
            <td>{config.username}</td>
            <td>
      {visiblePasswords[config.id] ? config.password : '******'}
      <button
        onClick={() => togglePasswordVisibility(config.id)}
        style={{
          marginLeft: '10px',
          cursor: 'pointer',
          border: 'none',
          background: 'transparent'
        }}
        title={visiblePasswords[config.id] ? "Hide Password" : "View Password"}
      >
        {visiblePasswords[config.id] ? '🙈' : '👁️'}
      </button>
    </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
};

export default Dashboard;
