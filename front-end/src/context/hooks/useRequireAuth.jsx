// src/hooks/useRequireAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const useRequireAuth = () => {
  const { isAuthenticated, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, authToken]);
};

export default useRequireAuth;
