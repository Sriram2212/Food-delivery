import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderTracking from './pages/OrderTracking';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  return isAdmin ? children : <Navigate to="/admin" />;
};

const AppContent = () => {
  const { pathname } = window.location;
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="App">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'Outfit, sans-serif'
        },
      }} />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<Menu />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
