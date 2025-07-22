import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { auth } = useAuth();

  if (!auth || !auth.token) {
    return <Navigate to="/admin/login" />;
  }

  // Si el usuario está autenticado y tiene el rol adecuado, renderiza el componente
  return <Component {...rest} />;
};

export default PrivateRoute;