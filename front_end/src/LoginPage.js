// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stateId, setStateId] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // if (response.ok) {
      //   const result = await response.json();
      //   onLoginSuccess(username);
      //   navigate('/');


      if (response.ok) {
        const result = await response.json();
        onLoginSuccess(username, password);
        navigate('/');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Incorrect username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, state_id: stateId, gender }),
      });

      if (response.ok) {
        const result = await response.json();
        setErrorMessage(result.message);
        navigate('/');
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrorMessage("Username already exists");
        } else {
          setErrorMessage(errorData.message || 'Error occurred during signup. Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  return (
    <div className="login-page">
      {isLogin ? (
        <form className="login-container" onSubmit={handleLogin}>
          <h2>Log in</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Log in</button>
          </div>
          <div className="form-switch">
            <p>Dont have an account?</p>
            <button type="button" onClick={toggleForm}>Sign up here</button>
          </div>
        </form>
      ) : (
        <form className="signup-container" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="State ID"
            value={stateId}
            required
            onChange={(e) => setStateId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Register</button>
          </div>
          <div className="form-switch">
            <p>Already have an account?</p>
            <button type="button" onClick={toggleForm}>Log in here</button>
          </div>
        </form>
      )}
      {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
    </div>
  );
}

export default LoginPage;
