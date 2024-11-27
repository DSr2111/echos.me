// client/src/pages/GetStarted.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStarted.css';

function GetStarted({ isLoggedIn }) {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className="get-started-container">
      <h1>Welcome to Echos.me!</h1>
      <p>Follow these steps to personalize your news experience:</p>
      <div className="get-started-section">
        <h2>1. Explore the News Feed</h2>
        <p>
          Start by visiting the <strong>News Feed</strong>. Here, you'll find a
          variety of articles based on the default settings.
        </p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          Go to News Feed
        </button>
      </div>
      <div className="get-started-section">
        <h2>2. Apply Your Preferences</h2>
        <p>
          Customize your news feed by adjusting your language and category
          preferences in the <strong>Settings Card</strong>.
        </p>
      </div>
      <div className="get-started-section">
        <h2>3. Search for Keywords</h2>
        <p>
          Use the <strong>Search Bar</strong> to find articles by entering your
          keywords. The results will be instantly filtered for your preferences.
        </p>
      </div>
      <div className="get-started-section">
        <h2>4. Create Your Chambers</h2>
        <p>
          Create personalized chambers by saving your preferences and keywords
          into a specific chamber. This helps you curate content tailored to
          your interests.
        </p>
        <button className="btn-secondary" onClick={() => navigate('/chambers')}>
          Create Chambers
        </button>
      </div>
      <div className="get-started-section">
        <h2>5. Consume Your Content</h2>
        <p>
          Visit your chambers anytime to find the latest curated content. Enjoy
          your personalized news experience!
        </p>
      </div>
      <button
        className="btn-primary get-started-finish"
        onClick={() => navigate('/dashboard')}
      >
        Get Started Now
      </button>
    </div>
  );
}

export default GetStarted;
