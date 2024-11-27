// server/index.js
const express = require('express');
const cors = require('cors');
const chamberRoutes = require('./routes/chamberRoutes');
const dotenv = require('dotenv'); // Import dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON requests
app.use('/api/chambers', chamberRoutes);

// Import the News API routes
const newsRoutes = require('./routes/newsRoutes');
app.use('/api/news', newsRoutes); // Use the News API routes under the /api/news path

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
