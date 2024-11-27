const express = require('express');
const router = express.Router();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// Test endpoint to check if API key works
router.get('/test', async (req, res) => {
  try {
    // Fetch top headlines as a simple test
    const response = await newsapi.v2.topHeadlines({
      country: 'us',
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from News API' });
  }
});

module.exports = router;
