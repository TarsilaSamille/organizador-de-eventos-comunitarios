import React from "react";
import api from "./axiosInstance";
import { styled } from "@mui/system";

import { Button } from "@mui/material";
const DefaultEventoButton = ({ eventoId }) => {
  const adicionarEventoPadrao = async () => {
    try {
      await api.post("/api/adicionarEventoPadrao/" + eventoId);
      alert("Evento padrão adicionada com sucesso");
      // Optionally, refresh the "ListaDeAjuda" component or the entire page
    } catch (error) {
      console.error("Error adding default evento:", error);
      alert("Erro ao adicionar evento padrão");
    }
  };

  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={adicionarEventoPadrao}
    >
      Adicionar Evento Padrão
    </StyledButton>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

export default DefaultEventoButton;
