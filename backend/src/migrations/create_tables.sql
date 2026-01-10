-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_mal_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_rating (user_id, anime_mal_id)
);

-- Watchlist table (Plan to Watch)
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_mal_id INT NOT NULL,
  title VARCHAR(255),
  image_url TEXT,
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_watchlist (user_id, anime_mal_id)
);

-- Watch History table
CREATE TABLE IF NOT EXISTS watch_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_mal_id INT NOT NULL,
  title VARCHAR(255),
  image_url TEXT,
  type VARCHAR(50),
  episodes_watched INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_history (user_id, anime_mal_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(100),
  anime_mal_id INT NOT NULL,
  review_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
