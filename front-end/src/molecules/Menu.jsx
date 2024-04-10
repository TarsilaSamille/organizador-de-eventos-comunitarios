import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../context/AuthContext";
// Styled component for the line separator
const LineSeparator = styled("hr")({
  width: "100%",
  border: 0,
  height: "2px",
  backgroundColor: "#333",
});

const Menu = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Organizador de Eventos Comunitarios
      </Typography>
      {isAuthenticated && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button component={Link} to="/tabelaDeEventos" variant="contained">
              Tabela de Eventos
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => logout()} variant="contained">
              Sair do Organizador
            </Button>
          </Grid>
        </Grid>
      )}
      <LineSeparator />
    </div>
  );
};

export default Menu;
