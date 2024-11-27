// client/src/components/Chamber.js

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './Chamber.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';

function Chamber() {
  const { chamberId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [chamber, setChamber] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noArticles, setNoArticles] = useState(false);

  useEffect(() => {
    const fetchChamberDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('Chambers')
          .select('*')
          .eq('chamber_id', chamberId)
          .single();

        if (error) throw error;

        setChamber(data);
        fetchArticles(data.keywords.join(','), data.language, data.category, 1);
      } catch (err) {
        console.error('Error fetching chamber details:', err.message);
        setError('Failed to load chamber details.');
      } finally {
        setLoading(false);
      }
    };

    fetchChamberDetails();
  }, [chamberId]);

  const fetchArticles = async (
    keywords,
    language,
    category,
    pageToFetch = 1
  ) => {
    const limit = 30;
    setLoading(pageToFetch === 1);
    setLoadingMore(pageToFetch > 1);
    setError('');
    setNoArticles(false);

    try {
      const API_KEY = process.env.REACT_APP_MEDIASTACK_API_KEY;

      const response = await fetch(
        `http://api.mediastack.com/v1/news?access_key=${API_KEY}&categories=${category}&languages=${language}&keywords=${keywords}&limit=${limit}&offset=${
          (pageToFetch - 1) * limit
        }`
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const articlesData = data.data || [];

      if (articlesData.length === 0) {
        setNoArticles(true);
        return;
      }

      setArticles((prevArticles) =>
        pageToFetch === 1 ? articlesData : [...prevArticles, ...articlesData]
      );
    } catch (err) {
      setError('Failed to load articles.');
      console.error('Error fetching articles:', err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFavorite = async (article) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (!currentUser) {
        alert('You must be logged in to favorite an article.');
        return;
      }

      const { data: existingFavorite, error: fetchError } = await supabase
        .from('Favorites')
        .select('favorite_id')
        .eq('user_uuid', currentUser.id)
        .eq('url', article.url)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingFavorite) {
        alert('This article is already in your favorites!');
        return;
      }

      const { error } = await supabase.from('Favorites').insert([
        {
          user_uuid: currentUser.id,
          url: article.url,
          title: article.title,
          image_url: article.image || '/placeholder.png',
          description: article.description || 'No description available',
        },
      ]);

      if (error) throw error;

      alert('Article added to favorites!');
    } catch (err) {
      console.error('Error saving favorite:', err.message);
      alert('Failed to favorite the article. Please try again later.');
    }
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: `Check out this news article: ${article.title}`,
          url: article.url,
        })
        .then(() => console.log('Article shared successfully!'))
        .catch((error) => console.error('Error sharing the article:', error));
    } else {
      alert('Your browser does not support the Web Share API.');
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loadingMore &&
      !noArticles
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loadingMore, noArticles]); // Dependencies for useCallback

  // Add event listener for scrolling and clean up
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]); // handleScroll is now stable

  const handleRefresh = () => {
    if (chamber) {
      fetchArticles(
        chamber.keywords.join(','),
        chamber.language,
        chamber.category,
        1
      );
    }
  };

  useEffect(() => {
    if (chamber) {
      fetchArticles(
        chamber.keywords.join(','),
        chamber.language,
        chamber.category,
        page
      );
    }
  }, [page, chamber]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, loadingMore, noArticles]);

  if (loading) return <div className="loading">Loading chamber details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="chamber-page">
      <button className="back-button" onClick={() => navigate('/chambers')}>
        &larr; Back
      </button>
      <h1 className="chamber-title">{chamber.name}</h1>
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh
      </button>
      <div className="article-grid">
        {articles?.length > 0 &&
          articles.map((article, index) => (
            <div key={index} className="article-card">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
              )}
              <h3>{article.title}</h3>
              <p>{article.description || 'No description available.'}</p>
              <div className="icon-section">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="heart-icon"
                  onClick={() => handleFavorite(article)}
                />
                <FontAwesomeIcon
                  icon={faShareAlt}
                  className="share-icon"
                  onClick={() => handleShare(article)}
                />
              </div>
            </div>
          ))}
      </div>
      {articles.length === 0 && !loading && (
        <div className="no-articles-message">
          No articles found for this chamber. Try adjusting the keywords or
          categories.
        </div>
      )}
    </div>
  );
}

export default Chamber;
