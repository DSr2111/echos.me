// client/src/components/Logout.js

import React from 'react';
import { logout } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Perform the logout action
      setIsLoggedIn(false); // Update state to indicate the user is logged out
      navigate('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error during logout:', error); // Log any errors during logout
      alert('Failed to log out. Please try again.'); // Notify the user in case of error
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default Logout;
