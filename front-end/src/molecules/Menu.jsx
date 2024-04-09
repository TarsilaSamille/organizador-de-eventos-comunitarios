import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";

// Styled component for the line separator
const LineSeparator = styled("hr")({
  width: "100%",
  border: 0,
  height: "2px",
  backgroundColor: "#333",
});

const Menu = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Organizador de Evento
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            component={Link}
            to="/tabelaDeEventos"
            variant="text"
            color="inherit"
          >
            Tabela de Eventos
          </Button>
        </Grid>
      </Grid>
      <LineSeparator />
    </div>
  );
};

export default Menu;
