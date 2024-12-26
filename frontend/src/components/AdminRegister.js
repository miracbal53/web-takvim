import React, { useState } from 'react';
import axios from 'axios';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/adminRegister', formData);
      setMessage('Kayıt Başarılı');
      console.log(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setMessage(err.response.data.errors.map(error => error.msg).join(', '));
      } else {
        setMessage('Kayıt Başarısız');
      }
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Admin Kayıt</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>İsim</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Şifre</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminRegister;