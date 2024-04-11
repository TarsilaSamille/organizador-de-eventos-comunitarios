import React, { useEffect, useState } from "react";
import api from "../context/axiosInstance.js";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditGrupoDialog from "../atoms/modal/EditGrupoDialog.jsx";
import { Link } from "react-router-dom"; // Import the Link component

const Grupos = ({ eventoId, refreshKey }) => {
  const [grupos, setGrupos] = useState([]);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (grupo) => {
    setEditingGrupo({ ...grupo });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

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
  }, [eventoId, isEditDialogOpen, refreshKey]);
  return (
    <div>
      <Typography variant="h6">
        Grupos <Link to={`/paginaDeDoacao/${eventoId}`}> Link geral</Link>
      </Typography>
      <Typography variant="body1" gutterBottom></Typography>
      <List>
        {grupos.map((grupo) => (
          <ListItem key={grupo._id} style={{ backgroundColor: grupo.cor }}>
            <ListItemText primary={grupo.nome} />

            <ListItemText
              primary={
                <Link to={`/paginaDeDoacao/${eventoId}/${grupo._id}`}>
                  Link para lista de {grupo.nome}
                </Link>
              }
            />
            <Button onClick={() => handleEditClick(grupo)} color="primary">
              Editar
            </Button>
          </ListItem>
        ))}
      </List>
      {editingGrupo && (
        <EditGrupoDialog
          open={isEditDialogOpen}
          grupo={editingGrupo}
          onClose={handleCloseEditDialog}
        />
      )}
    </div>
  );
};
export default Grupos;
