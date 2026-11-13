import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminAIAssistant } from './AdminAIAssistant'; // path apne mutabiq set kar lein

export const AdminRouteLayout = () => {
  return (
    <>
      <Outlet />
      <AdminAIAssistant />
    </>
  );
};