import React, { useEffect, useState } from "react";
import api from "../context/axiosInstance";
import {
  Modal,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";

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
    const fetchItens = async () => {
      try {
        const response = await api.get("/api/listaDeAjuda/" + eventoId);
        const itensComId = response.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setItens(itensComId);
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
  function generateCSSRules(rows) {
    let cssRules = "";

    itens.forEach((row) => {
      const color = row.grupoId.cor.replace("#", "");
      cssRules += `.row-color-${color} { background-color: ${row.grupoId.cor}!important; }\n`;
    });

    return cssRules;
  }

  const cssRules = generateCSSRules(itens);

  const styleElement = document.createElement("style");
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);

  const columns = [
    { field: "item", headerName: "Item", flex: 1 },
    { field: "preco", headerName: "Preço", flex: 1 },
    { field: "nomeDoDoador", headerName: "Nome do Irmão", flex: 1 },
    { field: "telefone", headerName: "Telefone", flex: 1 },
    {
      field: "metodoPagamentoOuEntrega",
      headerName: "Pix ou Entrega",
      flex: 1,
    },
    {
      field: "statusEntrega",
      headerName: "Entregue / Pix Feito",
      flex: 1,
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Excluir
          </Button>
        </>
      ),
    },
  ];

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

      <DataGrid
        autoHeight
        rows={itens}
        columns={columns}
        pageSize={50}
        rowHeight={40}
        getRowClassName={(params) =>
          `row-color-${params.row.grupoId.cor.replace("#", "")}`
        }
      />
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
