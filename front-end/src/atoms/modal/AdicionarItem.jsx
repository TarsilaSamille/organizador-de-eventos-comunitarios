import React, { useState } from "react";
import api from "./axiosInstance";
const AdicionarItem = () => {
  const [novoItem, setNovoItem] = useState({
    categoria: "",
    descricao: "",
    quantidade: 0,
    precoUnitario: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovoItem({ ...novoItem, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/api/itens", novoItem);
      console.log(response.data);
      setNovoItem({
        categoria: "",
        descricao: "",
        quantidade: 0,
        precoUnitario: 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Adicionar Novo Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Categoria:
          <input
            type="text"
            name="categoria"
            value={novoItem.categoria}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Descrição:
          <input
            type="text"
            name="descricao"
            value={novoItem.descricao}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Quantidade:
          <input
            type="number"
            name="quantidade"
            value={novoItem.quantidade}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Preço Unitário:
          <input
            type="number"
            name="precoUnitario"
            value={novoItem.precoUnitario}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Adicionar Item</button>
      </form>
    </div>
  );
};

export default AdicionarItem;
