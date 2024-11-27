import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error('No active session found. Redirecting to login...');
        }

        const { email } = session.user;

        const { data, error } = await supabase
          .from('Users')
          .select('username, email')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No user data found. Please check your account.');
        }

        setUserData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data.');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChangeUsername = async () => {
    const newUsername = prompt('Enter your new username:');
    if (!newUsername) return;

    try {
      const { error } = await supabase
        .from('Users')
        .update({ username: newUsername })
        .eq('email', userData.email);

      if (error) {
        throw error;
      }

      alert('Username updated successfully!');
      setUserData((prev) => ({ ...prev, username: newUsername }));
    } catch (err) {
      alert('Failed to update username. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      alert('Password updated successfully!');
    } catch (err) {
      alert('Failed to update password. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading your profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account details and preferences below.</p>
      </div>
      <div className="profile-box">
        <div className="profile-info">
          <h3>Account Details</h3>
          <div className="profile-info-row">
            <label className="profile-label">Username:</label>
            <span>{userData?.username}</span>
          </div>
          <div className="profile-info-row">
            <label className="profile-label">Email:</label>
            <span>{userData?.email}</span>
          </div>
          <div className="profile-info-row">
            <label className="profile-label">Password:</label>
            <span>********</span>
          </div>
        </div>
        <div className="profile-actions">
          <h3>Actions</h3>
          <button className="btn btn-primary" onClick={handleChangeUsername}>
            Change Username
          </button>
          <button className="btn btn-secondary" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
