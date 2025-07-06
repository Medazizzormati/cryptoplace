import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home/Home';
import Features from './pages/Features/Features';
import Pricing from './pages/Pricing/Pricing';
import Blog from './pages/Blog/Blog';
import Coin from './pages/Coin/Coin';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Vérifier le statut d'authentification au démarrage
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes>
          {/* Pages publiques - Accessibles sans authentification */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/coin/:coinId" element={<Coin />} />
          
          {/* Pages d'authentification - Redirigent vers dashboard si déjà connecté */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } 
          />
          
          {/* Pages protégées - Nécessitent une authentification */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection par défaut */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
