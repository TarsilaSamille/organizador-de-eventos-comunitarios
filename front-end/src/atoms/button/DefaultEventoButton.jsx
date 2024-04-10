import React from "react";
import api from "../../context/axiosInstance";
import { styled } from "@mui/system";
import { Button } from "@mui/material";
const DefaultEventoButton = ({ eventoId, refresh }) => {
  const adicionarEventoPadrao = async () => {
    try {
      await api.post("/api/eventos/adicionarEventoPadrao/" + eventoId);
      refresh();
      alert("Evento padrão adicionada com sucesso");
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
