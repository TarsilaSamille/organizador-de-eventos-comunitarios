import React, { useEffect, useState } from "react";
import api from "../context/axiosInstance";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import the Link component

const LinkParaPaginaDeDoacao = ({ eventoId }) => {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await api.get(`/api/grupos/${eventoId}`);
        setGrupos(response.data);
      } catch (error) {
        console.error("Error fetching grupos:", error);
      }
    };

    fetchGrupos();
  }, [eventoId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Link para Página e Doação
      </Typography>
      <Typography variant="body1" gutterBottom>
        <Link to={`/paginaDeDoacao/${eventoId}`}> Link geral</Link>
      </Typography>
      <Typography variant="h6" gutterBottom>
        Links por Grupo
      </Typography>
      <List>
        {grupos.map((grupo) => (
          <ListItem key={grupo._id}>
            <ListItemText
              primary={
                <Link to={`/paginaDeDoacao/${eventoId}/${grupo._id}`}>
                  {grupo.nome}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default LinkParaPaginaDeDoacao;
