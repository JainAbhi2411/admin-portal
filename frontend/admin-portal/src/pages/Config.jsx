import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Config = () => {
  const [form, setForm] = useState({
    tenant_id: '',
    host: '',
    port: '',
    username: '',
    password: ''
  });

  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get('http://localhost:8000/tenants');
      setTenants(res.data);
    } catch (err) {
      alert("Failed to load tenants.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/config', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert("Configuration saved!");
      setForm({ tenant_id: '', host: '', port: '', username: '', password: '' });
    } catch {
      alert("Failed to save configuration.");
    }
  };

  return (
    <div style={{ padding: '80px 20px' }}>
      <h2>⚙️ Add Source Configuration</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Tenant:</label><br />
        <select name="tenant_id" value={form.tenant_id} onChange={handleChange}>
          <option value="">Select Tenant</option>
          {tenants.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Host:</label><br />
        <input name="host" placeholder="DB Host" value={form.host} onChange={handleChange} />
      </div>

      <div>
        <label>Port:</label><br />
        <input name="port" placeholder="DB Port" value={form.port} onChange={handleChange} />
      </div>

      <div>
        <label>Username:</label><br />
        <input name="username" placeholder="DB Username" value={form.username} onChange={handleChange} />
      </div>

      <div>
        <label>Password:</label><br />
        <input type="password" name="password" placeholder="DB Password" value={form.password} onChange={handleChange} />
      </div>

      <button style={{ marginTop: '10px' }} onClick={handleSubmit}>
        Save Configuration
      </button>
    </div>
  );
};

export default Config;
