import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './FavoritedArticles.css';

function FavoritedArticles() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const currentUser = session?.user;

        if (!currentUser) {
          setError('You must be logged in to view your favorite articles.');
          setFavorites([]);
          return;
        }

        const { data, error } = await supabase
          .from('Favorites')
          .select('url, title, image_url, description, favorite_id')
          .eq('user_uuid', currentUser.id);

        if (error) throw error;

        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err.message);
        setError('Failed to load your favorite articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const { error } = await supabase
        .from('Favorites')
        .delete()
        .eq('favorite_id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter((fav) => fav.favorite_id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="favorites-container">
      <h2>Your Favorited Articles</h2>
      <div className="favorites-grid">
        {favorites.map((fav) => (
          <div key={fav.favorite_id} className="favorite-card">
            {/* Render the image only if it exists */}
            {fav.image_url && (
              <img
                src={fav.image_url}
                alt={fav.title}
                className="favorite-image"
              />
            )}
            <div className="favorite-content">
              <a href={fav.url} target="_blank" rel="noopener noreferrer">
                <h3>{fav.title}</h3>
              </a>
              {/* Always show the description */}
              <p>{fav.description}</p>
              <button
                className="remove-favorite-button"
                onClick={() => handleRemoveFavorite(fav.favorite_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritedArticles;
