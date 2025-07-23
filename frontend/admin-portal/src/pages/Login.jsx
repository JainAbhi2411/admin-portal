// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      window.location.href = '/';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="password" onChange={handleChange} placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
