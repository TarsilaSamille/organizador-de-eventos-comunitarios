// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, TextField, Box, Grid, Typography } from "@mui/material";
import api from "../../context/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginSuccess } = useAuth();

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
      navigate("/tabelaDeEventos");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">Login</Typography>

              <Grid item xs={12}>
                <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Button fullWidth type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth onClick={goToCreateUser} variant="contained">
                  Crie Usuario
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginForm;
