import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  let userInfo = null;

  try {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser && storedUser !== 'undefined') {
      userInfo = JSON.parse(storedUser);
    }
  } catch (error) {
    // Agar JSON parse mein koi bhi error aaye toh safely null rakho
    userInfo = null;
  }

  // Agar user logged in hai aur Admin bhi hai, tabhi andar jane do
  if (userInfo && userInfo.isAdmin === true) {
    return children;
  }

  // Warna chup chaap forcefully /login par bhej do
  return <Navigate to="/login" replace />;
};