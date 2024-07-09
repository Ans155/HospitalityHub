// Signup.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImg from '../images/image10.jfif'
const Signup = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('signup');
  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'signup' ? 'login' : 'signup'));
  };

  useEffect(() => {
    navigate(mode === 'signup' ? '/signup' : '/login');
  }, [mode, navigate]);

  const handleSignup = async () => {
    try {
      // Check if passwords match
      // if (password !== confirmPassword) {
      //   toast.error('Passwords do not match');
      //   return;
      // }
      console.log(email,password)
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        userEmail: email,
        password: password,
      });

      //toast.success(response.data.message);
      //console.log(response.data);
      navigate('/login');
    } catch (error) {
      //toast.error(error.response.data.message);
      //console.error('Signup error:', error.response.data);
    }
  };

  return (
    <div style={backgroundImageStyle}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
      <h1 className="navbar-brand">Welcome To HospitalityHub!</h1>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Signup</h2>
                <form>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <br/>
                  <button
                    type="button"
                    onClick={handleSignup}
                    className="btn btn-success btn-block"
                  >
                    Signup
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
      </div>
    </div>
  );
};

export default Signup;
