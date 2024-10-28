// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // Usar "jwtDecode" sin default import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded); // Verifica el contenido del token
      setUser({ ...decoded, token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    console.log("Token decodificado en login:", decoded); // Verifica el contenido del token en login
    setUser({ ...decoded, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;