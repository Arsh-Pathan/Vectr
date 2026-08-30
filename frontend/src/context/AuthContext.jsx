import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vectr_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        localStorage.setItem('vectr_token', token);
        try {
          const response = await api.get('/developer/profile');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // If token is invalid/expired, log out
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('vectr_token');
            setToken(null);
            setUser(null);
          }
        }
      } else {
        localStorage.removeItem('vectr_token');
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    if (userData) setUser(userData);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
