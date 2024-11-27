import React, { useState } from 'react';
import './SettingsCard.css';

function SettingsCard({ onUpdateSettings, onCreateChamber }) {
  const [language, setLanguage] = useState('en'); // Default to English
  const [category, setCategory] = useState('general'); // Default to general
  const [isVisible, setIsVisible] = useState(true); // Handle visibility

  const handleUpdate = () => {
    onUpdateSettings({ language, category }); // Update settings in parent
  };

  const handleCreateChamber = () => {
    if (!language && !category) {
      alert('Please select at least one setting to create a chamber.');
      return;
    }

    const chamberName = prompt('Enter a name for your Chamber:');
    if (!chamberName) return;

    onCreateChamber({ name: chamberName, language, category });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Toggle Button */}
      {!isVisible && (
        <div className="settings-tab" onClick={toggleVisibility}>
          <i className="bi bi-gear"></i>
        </div>
      )}

      {/* Settings Card */}
      <div className={`settings-card ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="settings-header">
          <h3 className="settings-heading">Preferences</h3>
          <div
            className="info-icon-container"
            data-tooltip="Select your preferred language, then category, and lastly use the search bar to filter for keywords."
          >
            <i className="bi bi-info-circle"></i>
          </div>
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="settings-select"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="settings-select"
          >
            <option value="general">General</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        {/* Update Button */}
        <button onClick={handleUpdate} className="update-button">
          Update
        </button>

        {/* Create Chamber Button */}
        <button onClick={handleCreateChamber} className="create-chamber-button">
          Create Chamber
        </button>

        {/* Hide Button */}
        <button onClick={toggleVisibility} className="hide-button">
          Hide
        </button>
      </div>
    </>
  );
}

export default SettingsCard;