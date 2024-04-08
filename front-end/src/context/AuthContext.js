// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export function loginSuccess(token, userId) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userId", userId);
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
}

export const authToken = () => {
  return localStorage.getItem("authToken");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};
