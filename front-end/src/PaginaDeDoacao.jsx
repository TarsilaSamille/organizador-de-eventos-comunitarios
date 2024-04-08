import React, { useEffect, useState } from "react";
import { Box, Typography, Checkbox, TextField, Button } from "@mui/material";
import api from "./axiosInstance";
import { useParams } from "react-router-dom";

const PaginaDeDoacao = () => {
  const { eventoId, grupoId } = useParams();
  const [itens, setItens] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [brotherName, setBrotherName] = useState("");
  const [brotherPhone, setBrotherPhone] = useState("");

  const [selectedOptions, setSelectedOptions] = useState({
    pix: false,
    entrega: false,
  });

  useEffect(() => {
    const fetchItens = async () => {
      try {
        let url = ` /listaDeAjuda/${eventoId}`;
        if (grupoId) {
          url += `/${grupoId}`; // Append grupoId to the URL if it's provided
        }
        const response = await api.get(url);
        setItens(response.data);
      } catch (error) {
        console.error("Error fetching Lista de Ajuda:", error);
      }
    };

    fetchItens();
  }, [eventoId, grupoId]);

  const handleItemSelect = (event, itemId) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleBrotherNameChange = (event) => {
    setBrotherName(event.target.value);
  };

  const handleBrotherPhoneChange = (event) => {
    setBrotherPhone(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const selectedOptionsString = Object.entries(selectedOptions)
        .filter(([key, value]) => value)
        .map(([key]) => key)
        .join(", ");

      const itemsToUpdate = selectedItems.map((itemId) => ({
        itemId,
        nomeDoIrmao: brotherName,
        telefone: brotherPhone,
        pixOuEntrega: selectedOptionsString,
      }));
      await api.post(" /atualizarItens", itemsToUpdate);
      alert("Itens atualizados com sucesso");
    } catch (error) {
      console.error("Error updating items:", error);
      alert("Erro ao atualizar itens");
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Página de Doação
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Doador"
          value={brotherName}
          onChange={handleBrotherNameChange}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Telefone"
          value={brotherPhone}
          onChange={handleBrotherPhoneChange}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <Typography variant="h4" gutterBottom>
          Tipo
        </Typography>
        <Box sx={{ marginBottom: 1 }}>
          <Checkbox
            id="pix"
            name="pix"
            checked={selectedOptions.pix}
            onChange={handleInputChange}
          />
          <label htmlFor="pix">Pix</label>
        </Box>
        <Box sx={{ marginBottom: 1 }}>
          <Checkbox
            id="entrega"
            name="entrega"
            checked={selectedOptions.entrega}
            onChange={handleInputChange}
          />
          <label htmlFor="entrega">Entrega</label>
        </Box>
        <Typography variant="h4" gutterBottom>
          Items
        </Typography>
        {itens.map((item, index) => (
          <Box key={index} sx={{ marginBottom: 1 }}>
            <Checkbox
              id={`item-${index}`}
              checked={selectedItems.includes(item._id)}
              onChange={(event) => handleItemSelect(event, item._id)}
            />
            <label htmlFor={`item-${index}`}>
              {item.item} - R$ {item.preco.toFixed(2)}
            </label>
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Assinar Nome na Lista
        </Button>
      </form>
    </Box>
  );
};

export default PaginaDeDoacao;
