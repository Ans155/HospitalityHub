// Login.js
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('login');
  const toggleMode = () => {
    console.log(mode, "clicked");
    // setMode((prevMode) => (prevMode === 'signup' ? 'login' : 'signup'));
    
    mode==='signup' ? (setMode('login')) : (setMode('signup'));
    //mode==='signup' ? navigate('/login') : navigate('/signup');
    console.log(mode);
  };

  useEffect(() => {
    mode==='signup' ? navigate('/signup') : navigate('/login');

 },[mode]);
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        userEmail: email,
        password: password,
      });

      toast.success('Login successful');
      console.log(response.data);
      navigate('/view');
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error.response.data);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form style={styles.form}>
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <br />
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <br />
        <button type="button" onClick={handleLogin} style={styles.button}>
          Login
        </button>
        <br />
        <p style={styles.toggleText}>
          {mode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
          <span style={styles.toggleButton} onClick={toggleMode}>
            {mode === 'signup' ? 'Login' : 'Signup'}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '3px solid blue',
    borderRadius: '8px',
    marginTop: '50px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: '10px 0',
    color: '#555',
  },
  input: {
    padding: '8px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  toggleText: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#333',
  },

  toggleButton: {
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '5px', // Add some spacing between Login and Signup
  },
};

export default Login;
