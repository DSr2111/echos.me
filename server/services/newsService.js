// server/services/newsService.js
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// Fetch top headlines
const fetchTopHeadlines = async (category = '', country = 'us') => {
  try {
    const response = await newsapi.v2.topHeadlines({
      category,
      country,
    });
    return response;
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

// Fetch articles by keyword
const fetchArticlesByKeyword = async (keyword) => {
  try {
    const response = await newsapi.v2.everything({
      q: keyword,
    });
    return response;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

module.exports = { fetchTopHeadlines, fetchArticlesByKeyword };
