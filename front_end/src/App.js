// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CarSearch from './CarSearch';
import LoginPage from './LoginPage';
import FullRankingList from './FullRankingList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (username, password) => {
    setUser({ username, password, isLoggedIn: true });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarSearch user={user} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/full-ranking" element={<FullRankingList />} />
      </Routes>
    </Router>
  );
}

export default App;