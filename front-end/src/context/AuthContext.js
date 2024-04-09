import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("authToken") != null
  );

  function loginSuccess(token, userId) {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId);
  }

  function logout() {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }

  const authToken = () => {
    return localStorage.getItem("authToken");
  };

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginSuccess, logout, authToken, getUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
