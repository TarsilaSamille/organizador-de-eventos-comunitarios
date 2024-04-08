import React, { useEffect, useState } from "react";
import api from "./axiosInstance";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditGrupoDialog from "./EditGrupoDialog.jsx";

const Grupos = ({ eventoId }) => {
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
        const response = await api.get(`/grupos/${eventoId}`);
        setGrupos(response.data);
      } catch (error) {
        console.error("Error fetching grupos:", error);
      }
    };

    fetchGrupos();
  }, [eventoId, isEditDialogOpen]);
  return (
    <div>
      <Typography variant="h6">Grupos</Typography>
      <List>
        {grupos.map((grupo) => (
          <ListItem key={grupo._id} style={{ backgroundColor: grupo.cor }}>
            <ListItemText primary={grupo.nome} />
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
