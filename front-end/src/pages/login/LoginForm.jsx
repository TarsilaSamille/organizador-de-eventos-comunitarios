// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useAuth, loginSuccess } from "../../context/AuthContext"; // Ajuste o caminho de importação conforme necessário
import { Button, TextField, Box } from "@mui/material";
import api from "../../context/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const goToCreateUser = () => {
    navigate("/create-user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        username,
        password,
      });
      const { token, userId } = response.data;
      loginSuccess(token, userId);
      login();
      navigate("/tabelaDeEventos");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Aqui você pode lidar com erros, como mostrar uma mensagem de erro ao usuário
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
      <Button onClick={goToCreateUser} variant="contained">
        Crie Usuario
      </Button>
    </>
  );
};

export default LoginForm;
