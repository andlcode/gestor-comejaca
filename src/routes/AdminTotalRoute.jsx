import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminTotalRoute = ({ children }) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const role = storedUser?.role || localStorage.getItem('role');

    if (role !== 'admin_total') {
      return <Navigate to="/painel" replace />;
    }
  } catch {
    if (localStorage.getItem('role') !== 'admin_total') {
      return <Navigate to="/painel" replace />;
    }
  }

  return children;
};

export default AdminTotalRoute;
