import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../context/axiosInstance";

const CreateUserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        username,
        password,
      });
      alert("usuario criado, indo para o loguin");
      setUsername("");
      setPassword("");
      setError("");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário. Por favor, tente novamente.");
    }
  };

  return (
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
      {error && <p>{error}</p>}
      <Button type="submit" variant="contained">
        Criar Usuário
      </Button>
    </Box>
  );
};

export default CreateUserForm;
