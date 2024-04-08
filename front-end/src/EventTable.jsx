import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import api from "./axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import useRequireAuth from "./hooks/useRequireAuth"; // Ajuste o caminho de importação conforme necessário
import { getUserId } from "./context/AuthContext";

const EventTable = () => {
  useRequireAuth();
  const userId = getUserId();

  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedEventoId, setSelectedEventoId] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/api/eventos/all/" + userId);
        console.log(response);
        setEventos(response.data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
      }
    };

    fetchEventos();
  }, [open, userId]);

  const handleDeleteEvento = async (eventoId) => {
    try {
      await api.delete(`/api/eventos/${eventoId}`);
      const updatedEventos = eventos.filter((evento) => evento.id !== eventoId);
      setEventos(updatedEventos);
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting evento:", error);
      // Handle error, e.g., show an error message
    }
  };
  const handleClickOpen = (eventoId) => {
    setSelectedEventoId(eventoId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          margin: "16px 16px", // Add margin to the top and bottom
        }}
      >
        <Typography variant="h6">Tabela de Eventos</Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/evento"
          style={{ marginBottom: "10px" }}
        >
          Adicionar Evento
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Evento</TableCell>
              <TableCell>Nome do Organizador</TableCell>
              <TableCell>Telefone do Organizador</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell>{evento.nome}</TableCell>
                <TableCell>{evento.nomeDoOrganizador}</TableCell>
                <TableCell>{evento.telefoneDoOrganizador}</TableCell>
                <TableCell>
                  <Grid container spacing={2} justifyContent="space_between">
                    <Grid item>
                      <Button onClick={() => navigate(`/evento/${evento._id}`)}>
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button onClick={() => handleClickOpen(evento._id)}>
                        Deletar
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Deleção"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza de que deseja deletar este evento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDeleteEvento(selectedEventoId)}
            color="primary"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventTable;
