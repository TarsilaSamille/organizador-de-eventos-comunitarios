import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import ConfirmationModal from "../atoms/modal/ConfirmationModal";
import DefaultEventoButton from "../atoms/button/DefaultEventoButton";
import api from "../context/axiosInstance";

const TabelaDeItens = ({ eventoId }) => {
  const [itens, setItens] = useState([]);
  const [editingItem, setEditingItem] = useState({
    categoria: "",
    descricao: "",
    quantidade: 0,
    precoUnitario: 0,
    eventoId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const response = await api.get("/api/itens/" + eventoId);
        setItens(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItens();
  }, [eventoId, isModalOpen]);

  const handleDelete = async (id) => {
    setDeleteItemId(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/itens/${deleteItemId}`);
      setItens(itens.filter((item) => item._id !== deleteItemId));
    } catch (error) {
      console.error(error);
    }
    setIsConfirmationModalOpen(false);
  };

  const handleEdit = (id) => {
    const item = itens.find((item) => item._id === id);
    setEditingItem(item);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingItem({
      categoria: "",
      descricao: "",
      quantidade: 0,
      precoUnitario: 0,
    });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        handleSubmitEdit();
      } else {
        handleSubmitSave();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitSave = async () => {
    await api.post("/api/itens", editingItem);
    setItens([...itens, editingItem]);
  };

  const handleSubmitEdit = async () => {
    await api.put(`/api/itens/${editingItem._id}`, editingItem);
    setItens(
      itens.map((item) => (item._id === editingItem._id ? editingItem : item))
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleGenerateListaDeAjudaForAll = async () => {
    try {
      await api.post(
        "/api/listaDeAjuda/generateListaDeAjudaForAll/" + eventoId
      );
      alert("Lista de Ajuda gerada com sucesso para todos os itens");
    } catch (error) {
      console.error("Error generating Lista de Ajuda for all items:", error);
      alert("Erro ao gerar Lista de Ajuda para todos os itens");
    }
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
        <Typography variant="h6">Tabela de Itens Necessários</Typography>
        <StyledButton variant="contained" color="primary" onClick={handleAdd}>
          Adicionar Item
        </StyledButton>
        <DefaultEventoButton eventoId={eventoId} />
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleGenerateListaDeAjudaForAll}
        >
          Gerar Lista de Ajuda
        </StyledButton>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Preço Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>
                  {(parseFloat(item.precoUnitario) || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  {(
                    (parseFloat(item.quantidade) || 0) *
                    (parseFloat(item.precoUnitario) || 0)
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Excluir
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(item._id)}
                  >
                    Editar
                  </StyledButton>
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
              label="Categoria"
              value={editingItem.categoria}
              onChange={(e) =>
                setEditingItem({ ...editingItem, categoria: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Descrição"
              value={editingItem.descricao}
              onChange={(e) =>
                setEditingItem({ ...editingItem, descricao: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Quantidade"
              type="number"
              value={editingItem.quantidade}
              onChange={(e) =>
                setEditingItem({ ...editingItem, quantidade: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Preço Unitário"
              type="number"
              value={editingItem.precoUnitario}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  precoUnitario: e.target.value,
                })
              }
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </form>
        </Box>
      </Modal>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        handleClose={handleCloseConfirmationModal}
        handleConfirm={confirmDelete}
      />
    </div>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

export default TabelaDeItens;
