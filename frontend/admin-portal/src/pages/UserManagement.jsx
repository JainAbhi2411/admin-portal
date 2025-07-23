import React, { useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'viewer',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    try {
      const params = new URLSearchParams(form).toString();
      await axios.post(`http://localhost:8000/users/create?${params}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("User created successfully!");
    } catch (err) {
      alert("Error creating user.");
    }
  };

  return (
    <div>
      <h2>User Management (Admin Only)</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} type="password" />
      <select name="role" onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
      <button onClick={handleCreate}>Create User</button>
    </div>
  );
};

export default UserManagement;
