// client/src/pages/Chambers.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './Chambers.css';

function Chambers() {
  const [chambers, setChambers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChambers = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          alert('You must be logged in to view Chambers.');
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('Chambers')
          .select('*')
          .eq('user_uuid', user.id);

        if (error) throw error;

        setChambers(data || []);
      } catch (error) {
        console.error('Error fetching chambers:', error.message);
        alert('Failed to load Chambers. Please try again.');
      }
    };

    fetchChambers();
  }, [navigate]);

  const handleDeleteChamber = async (chamberId) => {
    try {
      const { error } = await supabase
        .from('Chambers')
        .delete()
        .eq('chamber_id', chamberId);

      if (error) throw error;

      setChambers((prevChambers) =>
        prevChambers.filter((chamber) => chamber.chamber_id !== chamberId)
      );
    } catch (error) {
      console.error('Error deleting chamber:', error.message);
      alert('Failed to delete Chamber. Please try again.');
    }
  };

  return (
    <div className="chambers-container">
      <h1>Your Chambers</h1>
      <p>
        Explore and manage your personalized chambers for curated news and
        topics.
      </p>
      <div className="chambers-list">
        {chambers.length > 0 ? (
          chambers.map((chamber) => (
            <div
              key={chamber.chamber_id}
              className="chamber-card"
              onClick={() => navigate(`/chambers/${chamber.chamber_id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{chamber.name}</h3>
              <p>
                <strong>Language:</strong> {chamber.language}
              </p>
              <p>
                <strong>Category:</strong> {chamber.category}
              </p>
              {chamber.keywords && (
                <p>
                  <strong>Keywords:</strong>{' '}
                  {Array.isArray(chamber.keywords)
                    ? chamber.keywords.join(', ')
                    : chamber.keywords || 'No keywords'}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event bubbling to the card
                  handleDeleteChamber(chamber.chamber_id);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No chambers found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}

export default Chambers;
