const express = require("express");
const router = express.Router();
const authenticateToken = require("./utils");

const Item = require("../models/Item");
const ListaDeAjuda = require("../models/ListaDeAjuda");
const Grupo = require("../models/Grupo");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const listaDeAjuda = await ListaDeAjuda.find();
    res.json(listaDeAjuda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar lista de ajuda" });
  }
});

router.get("/:eventoId/:grupoId?", async (req, res) => {
  const { eventoId, grupoId } = req.params;
  try {
    const listaDeAjuda = await ListaDeAjuda.find(
      grupoId ? { eventoId, grupoId } : { eventoId }
    ).populate("grupoId", "nome cor");
    res.json(listaDeAjuda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar lista de ajuda" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const newItem = new ListaDeAjuda(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar item" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedItem = await ListaDeAjuda.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating item" });
  }
});

router.delete("/all", authenticateToken, async (req, res) => {
  try {
    await ListaDeAjuda.deleteMany({});
    res.json({ message: "All items deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting all items" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedItem = await ListaDeAjuda.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

router.post(
  "/generateListaDeAjudaForAll/:eventoId",
  authenticateToken,
  async (req, res) => {
    const { eventoId } = req.params;
    try {
      const items = await Item.find({ eventoId: eventoId });
      const grupos = await Grupo.find({ eventoId: eventoId });

      validateItemsAndGroups(items, grupos);

      const totalValueItems = calculateTotalValue(items);

      assignItemsToGroups(
        items,
        grupos,
        totalValueItems / grupos.length,
        eventoId
      );

      res.json({
        message: "Lista de Ajuda gerada com sucesso para todos os itens",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro ao gerar Lista de Ajuda para todos os itens",
        error,
      });
    }
  }
);

const validateItemsAndGroups = (items, grupos) => {
  if (items.length === 0) {
    throw new Error("Nenhum item encontrado para o evento fornecido");
  }
  if (grupos.length === 0) {
    throw new Error("Nenhum grupo encontrado para o evento fornecido");
  }
};

const calculateTotalValue = (items) => {
  const totalValueItems = items.reduce(
    (total, item) => total + item.precoUnitario * item.quantidade,
    0
  );
  if (isNaN(totalValueItems) || totalValueItems <= 0) {
    throw new Error("Valor total dos itens inválido ou não disponível");
  }
  return totalValueItems;
};

const assignItemsToGroups = async (items, grupos, valuePerGroup, eventoId) => {
  let assignedValue = 0;
  let gruposIndex = 0;

  for (const item of items) {
    for (let i = 1; i <= item.quantidade; i++) {
      if (assignedValue >= valuePerGroup && gruposIndex < grupos.length) {
        assignedValue = 0;
        gruposIndex++;
      }
      const listaDeAjudaEntry = new ListaDeAjuda({
        item: `${item.descricao} (${i})`,
        preco: item.precoUnitario,
        eventoId,
        grupoId: grupos[gruposIndex]._id,
        statusEntrega: false,
      });
      await listaDeAjudaEntry.save();
      assignedValue += item.precoUnitario;
    }
  }
};

module.exports = router;
