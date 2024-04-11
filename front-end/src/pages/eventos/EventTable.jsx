import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import api from "../../context/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import useRequireAuth from "../../context/hooks/useRequireAuth"; // Ajuste o caminho de importação conforme necessário
import { useAuth } from "../../context/AuthContext";

const EventTable = () => {
  useRequireAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedEventoId, setSelectedEventoId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const { getUserId } = useAuth();
  const userId = getUserId();
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/api/eventos/all");
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
      <div className="flex items-center justify-between mb-3">
        <div></div>
        <Link component={Link} to="/evento">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-md">
            Adicionar Evento
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome do Evento
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome do Organizador
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Telefone do Organizador
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td className="px-6 py-4 whitespace-nowrap">{evento.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.nomeDoOrganizador}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.telefoneDoOrganizador}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/evento/${evento._id}`)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-md"
                    >
                      Editar{" "}
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      onClick={() => handleClickOpen(evento._id)}
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmar Deleção"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Você tem certeza de que deseja deletar este evento?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => handleClose()}
            >
              Cancelar
            </button>

            <button
              onClick={() => handleDeleteEvento(selectedEventoId)}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Confirmar
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EventTable;
