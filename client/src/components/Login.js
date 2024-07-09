// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import backgroundImg from '../images/banner.jpg'
const Login = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // console.log(backendUrl)
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const handleDefaultAdminAccess = () => {
    setEmail('admin@example.com');
    setPassword('adminpassword');
  };
  
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'signup' ? 'login' : 'signup'));
  };

  useEffect(() => {
    navigate(mode === 'signup' ? '/signup' : '/login');
  }, [mode, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        userEmail: email,
        password: password,
      });

      toast.success('Login successful');
      //console.log(response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      //console.log(userRole);
      if(userRole==='admin')
      {
        navigate('/dashboard')
      }
      else
      navigate('/create');
    } catch (error) {
      toast.error('Login failed');
     // console.error('Login error:', error.response.data);
    }
  };
  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={backgroundImageStyle}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-4">
      <h1 className="navbar-brand">Welcome To HospitalityHub!</h1>
      </nav>
    <br/>
    <br/>
      <div className="container">
        <div className="card col-md-6 offset-md-3 shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <button
                type="button"
                onClick={handleLogin}
                className="btn btn-success btn-block"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleDefaultAdminAccess}
                className="btn btn-primary btn-block mt-6"
                style={{marginLeft:'50px'}}
              >
                Default Admin Access
              </button>
              <p className="text-center mt-3">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                <span
                  className="text-primary ml-1"
                  onClick={toggleMode}
                  style={{ cursor: 'pointer' }}
                >
                  {mode === 'signup' ? ' Login' : ' Signup'}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
