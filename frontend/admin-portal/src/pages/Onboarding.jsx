// src/pages/Onboarding.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Onboarding = () => {
  const [form, setForm] = useState({ name: '', email: '', timezone: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/tenants', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Tenant onboarded!');
    } catch (err) {
      alert('Failed to create tenant');
    }
  };

  return (
    <div>
      <h2>Customer Onboarding</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="timezone" placeholder="Timezone" onChange={handleChange} />
      <button onClick={handleSubmit}>Create Tenant</button>
    </div>
  );
};

export default Onboarding;
