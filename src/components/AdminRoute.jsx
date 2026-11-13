import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

  if (userInfo && userInfo.isAdmin) {
    return children;
  }

  return <Navigate to="/login" replace />;
};