import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Checking administrator privileges..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message: 'Please log in as an administrator.' }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
