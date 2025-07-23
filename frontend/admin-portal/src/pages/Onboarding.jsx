// src/pages/Onboarding.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Onboarding = () => {
  const [form, setForm] = useState({ name: '', email: '', timezone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.timezone) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('https://admin-portal-l8su.onrender.com/tenants', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('✅ Tenant onboarded successfully!');
      setError('');
      setForm({ name: '', email: '', timezone: '' });
    } catch (err) {
      setSuccess('');
      setError('❌ Failed to create tenant');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚀 Customer Onboarding</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            name="name"
            placeholder="Enter customer name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            name="email"
            placeholder="Enter customer email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Timezone</label>
          <input
            name="timezone"
            placeholder="e.g. Asia/Kolkata"
            value={form.timezone}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Create Tenant
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

export default Onboarding;
