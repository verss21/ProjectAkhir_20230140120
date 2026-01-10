const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});