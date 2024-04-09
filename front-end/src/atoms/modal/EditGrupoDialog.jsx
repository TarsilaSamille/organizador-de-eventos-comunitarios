import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputLabel,
} from "@mui/material";
import api from "../../context/axiosInstance";
import { CirclePicker } from "react-color";

const EditGrupoDialog = ({ open, grupo, onClose }) => {
  const [localGrupo, setLocalGrupo] = useState(grupo);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedGrupo = await api.put(
        `/api/grupos/${grupo._id}`,
        localGrupo
      );
      console.log(updatedGrupo);
      onClose(); // Feche o diálogo
    } catch (error) {
      console.error("Error updating grupo:", error);
    }
  };

  const handleColorChange = ({ hex }) => {
    setLocalGrupo({ ...localGrupo, cor: hex });
  };

  useEffect(() => {
    setLocalGrupo(grupo);
  }, [grupo]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Grupo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel htmlFor="component-simple">Nome do Grupo</InputLabel>

            <TextField
              value={localGrupo.nome || ""}
              onChange={(e) =>
                setLocalGrupo({ ...localGrupo, nome: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="component-simple">Color</InputLabel>
            <CirclePicker
              onChangeComplete={handleColorChange}
              color={localGrupo.cor || "#EB9694"}
              width={"500px"}
              triangle={"none"}
              colors={[
                "#EB9694",
                "#FAD0C3",
                "#FEF3BD",
                "#C1E1C5",
                "#BEDADC",
                "#C4DEF6",
                "#BED3F3",
                "#D4C4FB",
              ]}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button onClick={onClose}>Cancelar</Button>
          </Grid>
          <Grid item>
            <Button onClick={(e) => handleSubmit(e)} color="primary">
              Salvar
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EditGrupoDialog;
