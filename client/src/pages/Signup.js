import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!username.trim()) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);

      try {
        const { data, error } = await supabase
          .from('Users')
          .select('username')
          .eq('username', username.trim());

        if (error) {
          console.error('Error checking username availability:', error);
          setUsernameAvailable(null);
        } else if (data.length === 0) {
          // No rows found, username is available
          setUsernameAvailable(true);
        } else {
          // Username exists
          setUsernameAvailable(false);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameAvailable) {
      setMessage('Username is not available. Please choose another.');
      return;
    }

    try {
      // Sign up user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        setMessage('Failed to sign up. Please try again.');
        return;
      }

      // Add user to Users table
      const { error: dbError } = await supabase.from('Users').insert([
        {
          username: username.trim(),
          email: email.trim(),
          user_uuid: authData.user.id,
        },
      ]);

      if (dbError) {
        setMessage('Failed to save user details. Please try again.');
        return;
      }

      setMessage('Signup successful! Please verify your email.');
    } catch (err) {
      console.error('Signup error:', err);
      setMessage('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h3 className="text-center mb-4">Sign Up</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {username && (
            <small
              className={`form-text ${
                usernameAvailable ? 'text-success' : 'text-danger'
              }`}
            >
              {checkingUsername
                ? 'Checking availability...'
                : usernameAvailable
                ? 'Username is available!'
                : 'Username is taken, please choose another.'}
            </small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={checkingUsername || usernameAvailable === false}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
