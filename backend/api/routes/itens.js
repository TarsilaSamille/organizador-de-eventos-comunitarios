const express = require("express");
const router = express.Router();
const authenticateToken = require("./utils");

const Item = require("../models/Item");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const itens = await Item.find();
    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar itens" });
  }
});

router.get("/:eventoId", authenticateToken, async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const itens = await Item.find({ eventoId });
    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar itens" });
  }
});

const ListaDeAjuda = require("../models/ListaDeAjuda");

router.post("/", authenticateToken, async (req, res) => {
  const novoItem = new Item(req.body);
  try {
    await novoItem.save();
    for (let i = 1; i <= novoItem.quantidade; i++) {
      const listaDeAjudaEntry = new ListaDeAjuda({
        item: `${novoItem.descricao} (${i})`,
        preco: novoItem.precoUnitario,
        statusEntrega: false,
      });
      await listaDeAjudaEntry.save();
    }
    res.status(201).json(novoItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar item" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating item" });
  }
});

router.post("/atualizarItens", authenticateToken, async (req, res) => {
  try {
    const itemsToUpdate = req.body;
    const updatePromises = itemsToUpdate.map((item) =>
      ListaDeAjuda.findByIdAndUpdate(
        item.itemId,
        {
          nomeDoIrmao: item.nomeDoIrmao,
          telefone: item.telefone,
          metodoPagamentoOuEntrega: item.pixOuEntrega,
        },
        { new: true }
      )
    );
    await Promise.all(updatePromises);
    res.status(200).json({ message: "Itens atualizados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar itens" });
  }
});

module.exports = router;
