import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/api/serverConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : {
      token: null,
      username: null,
      nombreCompleto: null,
      correo: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const resetAuth = () => {
    setAuth({
      token: null,
      username: null,
      nombreCompleto: null,
      correo: null,
    });
  };

  const login = async (credentials) => {

    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, credentials);
      const userData = {
        id: response.data.id,
        token: response.data.token,
        username: response.data.username,
        nombreCompleto: response.data.nombreCompleto,
        correo: response.data.correo,
      };
      setAuth(userData);
      localStorage.setItem('auth', JSON.stringify(userData));
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      window.alert('Usuario o contraseña incorrecta');
    }
  };

  const logout = async () => {
    try {
      const { username, token } = auth;
      await axios.get(`${BASE_URL}/api/users/logout/${username}`, {
        headers: {
          Authorization: auth.token,
        },
      });
      const emptyAuth = {
        token: null,
        username: null,
        nombreCompleto: null,
        correo: null,
      };
      setAuth(emptyAuth);
      localStorage.removeItem('auth');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

    const register = async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, credentials);
      const userData = {
        token: response.data.token,
        username: response.data.username,
        cc: response.data.cc,
        nombres: response.data.nombres,
        apellidos: response.data.apellidos,
        celular: response.data.celular,
        correo: response.data.correo,
        role: response.data.role
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      window.alert('Ocurrió un error al registrar el usuario');
    }
  };

  const value = {
    auth,
    login,
    logout,
    resetAuth,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};