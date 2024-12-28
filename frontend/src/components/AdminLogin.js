import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/adminAuth",
        formData
      );
      setMessage("Giriş Başarılı");
      localStorage.setItem("token", res.data.token);
      onLogin(true, res.data.name);
      console.log(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setMessage(
          err.response.data.errors.map((error) => error.msg).join(", ")
        );
      } else {
        setMessage("Giriş Başarısız");
      }
      console.error(err.response.data);
    }
  };

  return (
    <div className="calendar-form">
      <h2>Admin Girişi</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Şifre</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLogin;
