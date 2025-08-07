import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { ClipLoader } from "react-spinners";
import Image from 'next/image';
import styles from '@/styles/Login.module.css'

const Login = () => {
  const router = useRouter();
  const { login, auth, resetAuth } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reseteamos auth al cargar el componente de login para evitar redirecciones previas
    resetAuth();
  }, []);

  useEffect(() => {
    if (auth.token) {
        router.push('/admin/dashboard');
      }
  }, [auth, router]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <Image src="/gallery5.jpg" alt="Telonero" height={150} width={100} className={styles.logo} priority/>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                className={styles.inputField}
              />
              <span className={styles.icon}>&#128100;</span> {/* Ícono de usuario */}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={styles.inputField}
              />
              <span className={styles.icon}>&#128274;</span> {/* Ícono de candado */}
            </div>
            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? <ClipLoader size={16} color="#fff" /> : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>  
    </div>
  );
};
export default Login;