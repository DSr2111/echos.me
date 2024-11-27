import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HomePage from './pages/HomePage';
import FavoritedArticles from './pages/FavoritedArticles';
import Chambers from './pages/Chambers'; // Import Chambers page
import GetStarted from './pages/GetStarted';
import Chamber from './components/Chamber';
import AppNavbar from './components/Navbar';
import { logout } from './services/AuthService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate('/'); // Redirect to main page after logout
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <div className="App">
      <AppNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main className="content-container">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/favorites"
            element={<FavoritedArticles isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/get-started"
            element={<GetStarted isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/profile"
            element={<Profile isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/chambers"
            element={<Chambers isLoggedIn={isLoggedIn} />}
          />
          <Route path="/chambers/:chamberId" element={<Chamber />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
