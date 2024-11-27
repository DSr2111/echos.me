import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faShareAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../services/supabaseClient';
import './NewsFeed.css';
import SearchBar from './SearchBar';

function NewsFeed({ refreshKey, settings, onKeywordUpdate, useCachedData }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cache, setCache] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [page, setPage] = useState(1);
  const [noArticles, setNoArticles] = useState(false);
  const [backupArticles, setBackupArticles] = useState([]);

  const fetchArticles = async (
    query = '',
    filters = settings,
    forceRefresh = false,
    pageToFetch = 1
  ) => {
    const cacheKey = `${query}-${filters.language}-${filters.category}-${pageToFetch}`;

    if (!forceRefresh && cache[cacheKey]) {
      setArticles((prevArticles) => [...prevArticles, ...cache[cacheKey]]);
      setFilteredArticles((prevArticles) => [
        ...prevArticles,
        ...cache[cacheKey],
      ]);
      return;
    }

    const limit = 30;
    setLoading(pageToFetch === 1);
    setLoadingMore(pageToFetch > 1);
    setError('');
    setNoArticles(false);

    try {
      const API_KEY = process.env.REACT_APP_MEDIASTACK_API_KEY;

      // Save current articles as a backup in case of failure
      setBackupArticles(articles);

      const response = await fetch(
        `http://api.mediastack.com/v1/news?access_key=${API_KEY}&categories=${
          filters.category
        }&languages=${
          filters.language
        }&keywords=${query}&limit=${limit}&offset=${(pageToFetch - 1) * limit}`
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const articlesData = data.data || [];

      if (articlesData.length === 0 && pageToFetch === 1) {
        setNoArticles(true); // No articles at all for the current settings
        return;
      }

      if (articlesData.length === 0) {
        setNoArticles(true); // No more articles to load for infinite scroll
        return;
      }

      const uniqueArticles = articlesData.filter(
        (article, index, self) =>
          index === self.findIndex((a) => a.title === article.title)
      );

      setCache((prevCache) => ({ ...prevCache, [cacheKey]: uniqueArticles }));
      setArticles((prevArticles) =>
        forceRefresh ? uniqueArticles : [...prevArticles, ...uniqueArticles]
      );
      setFilteredArticles((prevArticles) =>
        forceRefresh ? uniqueArticles : [...prevArticles, ...uniqueArticles]
      );
      setLastRefreshTime(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching articles:', err.message);

      // Restore previous articles in case of failure
      setArticles(backupArticles);
      setFilteredArticles(backupArticles);
      setError('Failed to load more articles. Try again later.');
    } finally {
      setLoading(false); // Stop loading spinner
      setLoadingMore(false); // Stop loading more spinner
    }
  };

  const handleSearch = (query) => {
    setPage(1);
    setArticles([]);
    setFilteredArticles([]);
    if (query && !keywords.includes(query)) {
      const updatedKeywords = [...keywords, query]; // Add new keyword
      setKeywords(updatedKeywords);
      onKeywordUpdate(updatedKeywords);
    }
    fetchArticles(keywords.join(','), settings, true, 1); // Send all keywords as a comma-separated string
  };

  const removeKeyword = (keyword) => {
    const updatedKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(updatedKeywords);
    setPage(1);
    setArticles([]);
    setFilteredArticles([]);
    fetchArticles(updatedKeywords.join(','), settings, true, 1); // Update API with remaining keywords
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
          image_url: article.image || '/placeholder1.png',
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

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loadingMore &&
      !noArticles
    ) {
      if (!noArticles) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (useCachedData) {
      fetchArticles('', settings, false, 1);
    }
  }, [settings, useCachedData]);

  useEffect(() => {
    fetchArticles(keywords.join(','), settings, true, 1);
  }, [refreshKey, settings]);

  useEffect(() => {
    fetchArticles(keywords.join(','), settings, true, 1); // Reset to page 1 when keywords change
  }, [keywords, settings]);

  useEffect(() => {
    fetchArticles(keywords.join(','), settings, false, page);
  }, [page, settings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, noArticles]);

  if (loading) {
    return <div className="spinner-container">Loading news...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="newsfeed-container">
      <h2 className="newsfeed-heading">Newsfeed</h2>
      <SearchBar onSearch={handleSearch} />
      {lastRefreshTime && (
        <div className="last-refresh-time">
          Last refreshed: {lastRefreshTime}
        </div>
      )}
      <div className="keywords-container">
        {keywords.map((keyword, index) => (
          <span key={index} className="keyword">
            {keyword}
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="remove-icon"
              onClick={() => removeKeyword(keyword)}
            />
          </span>
        ))}
      </div>
      {noArticles ? (
        <div className="no-articles-message">
          No articles found for your current settings. Please adjust your
          preferences.
        </div>
      ) : loading ? (
        <div className="spinner-container">Loading news...</div>
      ) : (
        <ul className="news-list">
          {filteredArticles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-item-link"
            >
              <li className="news-item">
                {article.image && (
                  <img
                    src={article.image || '/placeholder1.png'}
                    alt={article.title}
                    className="thumbnail"
                  />
                )}
                <span className="news-title">{article.title}</span>
                <div className="news-category">
                  {article.category || 'Uncategorized'}
                </div>
                <div className="icon-section">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="heart-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavorite(article);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    className="share-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShare(article);
                    }}
                  />
                </div>
              </li>
            </a>
          ))}
        </ul>
      )}
      {loadingMore && (
        <div className="spinner-container">Loading more articles...</div>
      )}
    </div>
  );
}

export default NewsFeed;
