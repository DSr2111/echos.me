// client/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsFeed from '../components/NewsFeed';
import SettingsCard from '../components/SettingsCard';
import './Dashboard.css';
import { supabase } from '../services/supabaseClient';

function Dashboard({ isLoggedIn }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [settings, setSettings] = useState({
    language: 'en',
    category: 'general',
  });
  const [keywords, setKeywords] = useState([]); // Track keywords
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Show a loading message before redirect
      console.log('User is not logged in. Redirecting to login...');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment refresh key
  };

  const handleKeywordUpdate = (updatedKeywords) => {
    console.log('Keywords updated in Dashboard:', updatedKeywords); // Debugging
    setKeywords(updatedKeywords);
    setSettings((prevSettings) => ({
      ...prevSettings,
      keywords: updatedKeywords.join(','), // Send keywords as a string
    }));

    setRefreshKey((prevKey) => prevKey + 1); // Trigger a refresh in NewsFeed
  };

  const handleCreateChamber = async (chamberData) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error('Supabase user error:', userError.message);
        alert('An error occurred while validating the user. Please try again.');
        return;
      }

      if (!user) {
        alert('You must be logged in to create a Chamber.');
        return;
      }

      console.log('Final keywords sent to Supabase:', keywords); // Debugging line

      const { data, error } = await supabase.from('Chambers').insert([
        {
          ...chamberData,
          user_uuid: user.id,
          keywords: keywords, // No transformation needed
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error.message);
        alert(
          'Failed to create Chamber. Please check your inputs and try again.'
        );
        return;
      }

      alert(`Chamber "${chamberData.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating chamber:', error.message);
      alert('Failed to create Chamber. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <SettingsCard
        onUpdateSettings={handleUpdateSettings}
        onCreateChamber={handleCreateChamber}
      />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Breaking News</h1>
          <p>Use these to create your chambers for curated content.</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Refresh
          </button>
        </header>
        <main className="dashboard-main">
          <NewsFeed
            refreshKey={refreshKey}
            settings={settings}
            onKeywordUpdate={handleKeywordUpdate}
            useCachedData={refreshKey === 0}
          />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
