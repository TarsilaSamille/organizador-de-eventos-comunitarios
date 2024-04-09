import React, { useEffect, useState } from "react";
import api from "../context/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Modal,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const ListaDeAjuda = ({ eventoId }) => {
  const [itens, setItens] = useState([]);
  const [editingItem, setEditingItem] = useState({
    item: "",
    preco: 0,
    nomeDoDoador: "",
    telefone: "",
    metodoPagamentoOuEntrega: "",
    statusEntrega: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
  }, [eventoId]); // Depend on eventoId to refetch when it changes

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const response = await api.get("/api/listaDeAjuda/" + eventoId);
        setItens(response.data);
      } catch (error) {
        console.error("Error fetching Lista de Ajuda:", error);
      }
    };

    fetchItens();
  }, [eventoId]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/listaDeAjuda/${id}`);
      setItens(itens.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const getColor = (id) =>
    grupos.find((grupo) => grupo._id === id)?.cor || "#fffff";
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/listaDeAjuda/${editingItem._id}`, editingItem);
        setItens(
          itens.map((item) =>
            item._id === editingItem._id ? editingItem : item
          )
        );
        alert("Item atualizado com sucesso");
      } else {
        // Handle adding a new item if necessary
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Erro ao atualizar item");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClearList = async () => {
    try {
      await api.delete("/api/listaDeAjuda/all");
      setItens([]); // Clear the local state
      alert("Toda a lista de ajuda foi excluída com sucesso");
    } catch (error) {
      console.error("Error clearing the list:", error);
      alert("Erro ao excluir toda a lista de ajuda");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom></Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          margin: "16px 16px", // Add margin to the top and bottom
        }}
      >
        <Typography variant="h6">Lista de Ajuda</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearList}
          style={{ marginBottom: "10px" }}
        >
          Zerar Lista de Ajuda
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Nome do Irmão</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Pix ou Entrega</TableCell>
              <TableCell>Entregue / Pix Feito</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.map((item, index) => (
              <TableRow
                key={index}
                style={{
                  backgroundColor: getColor(item.grupoId),
                }}
              >
                <TableCell>{item.item}</TableCell>
                <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                <TableCell>{item.nomeDoDoador}</TableCell>
                <TableCell>{item.telefone}</TableCell>
                <TableCell>{item.metodoPagamentoOuEntrega}</TableCell>
                <TableCell>
                  {item.statusEntrega ? <CheckIcon /> : <CloseIcon />}
                </TableCell>{" "}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Editar Item" : "Adicionar Item"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Item"
              value={editingItem ? editingItem.item : ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, item: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Preço"
              type="number"
              value={editingItem ? editingItem.preco : ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, preco: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nome do Irmão"
              value={editingItem ? editingItem.nomeDoDoador : ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, nomeDoDoador: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefone"
              value={editingItem ? editingItem.telefone : ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, telefone: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Pix ou Entrega"
              value={editingItem ? editingItem.metodoPagamentoOuEntrega : ""}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  metodoPagamentoOuEntrega: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editingItem?.statusEntrega || false} // Use optional chaining and provide a default value
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      statusEntrega: e.target.checked,
                    })
                  }
                />
              }
              label="Entregue / Pix Feito"
            />
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ListaDeAjuda;
