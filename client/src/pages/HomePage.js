// client/src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isLoggedIn }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Echos.me</h1>
        <p className="slogan">
          Your personalized echo chamber for news that matters.
        </p>
      </header>
      <main className="home-main">
        {isLoggedIn ? (
          <div>
            <p>
              Welcome back! Head over to News to continue curating or head over
              to your Chambers for the latest updates!
            </p>
            <Link to="/dashboard" className="cta-button">
              See Latest News
            </Link>
            <Link to="/chambers" className="cta-button">
              My Chambers
            </Link>
          </div>
        ) : (
          <div>
            <p>Join now to personalize your news feed and stay informed.</p>
            <div className="auth-links">
              <Link to="/signup" className="cta-button">
                Sign Up
              </Link>
              <Link to="/login" className="cta-button secondary">
                Login
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
