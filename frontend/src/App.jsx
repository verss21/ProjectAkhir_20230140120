import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import LocalDetail from './pages/LocalDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import Seasonal from './pages/Seasonal';
import TopAnime from './pages/TopAnime';
import Login from './pages/Login';
import Register from './pages/Register';


import { ThemeProvider } from './context/ThemeContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <ThemeProvider>
      <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] transition-colors duration-300">
        {!hideNavbar && token && <Navbar />}

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
            <Route path="/seasonal" element={<PrivateRoute><Seasonal /></PrivateRoute>} />
            <Route path="/top" element={<PrivateRoute><TopAnime /></PrivateRoute>} />

            <Route path="/anime/:id" element={<PrivateRoute><AnimeDetail /></PrivateRoute>} />
            <Route path="/anime/local/:id" element={<PrivateRoute><LocalDetail /></PrivateRoute>} />

            <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;