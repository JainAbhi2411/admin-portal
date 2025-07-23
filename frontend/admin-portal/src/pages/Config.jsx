import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Config = () => {
  const [form, setForm] = useState({
    tenant_id: '',
    host: '',
    port: '',
    username: '',
    password: '',
  });

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get('https://admin-portal-l8su.onrender.com/tenants');
      setTenants(res.data);
    } catch (err) {
      setError("❌ Failed to load tenants.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.tenant_id || !form.host || !form.port || !form.username || !form.password) {
      setError("All fields are required.");
      setSuccess('');
      return;
    }

    try {
      await axios.post('https://admin-portal-l8su.onrender.com/config', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess("✅ Configuration saved!");
      setError('');
      setForm({ tenant_id: '', host: '', port: '', username: '', password: '' });
    } catch {
      setError("❌ Failed to save configuration.");
      setSuccess('');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>⚙️ Add Source Configuration</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Tenant</label>
          <select
            name="tenant_id"
            value={form.tenant_id}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Host</label>
          <input
            name="host"
            value={form.host}
            placeholder="DB Host"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Port</label>
          <input
            name="port"
            value={form.port}
            placeholder="DB Port"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            name="username"
            value={form.username}
            placeholder="DB Username"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="DB Password"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f6',
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '26px',
    color: '#2d3436',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#2d3436',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0984e3',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};

export default Config;
