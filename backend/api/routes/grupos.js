const express = require("express");
const router = express.Router();
const authenticateToken = require("./utils");

const Grupo = require("../models/Grupo");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const novoGrupo = new Grupo(req.body);
    await novoGrupo.save();
    res.status(201).json(novoGrupo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar grupo" });
  }
});

router.get("/:eventoId", authenticateToken, async (req, res) => {
  try {
    const grupos = await Grupo.find({ eventoId: req.params.eventoId });
    res.json(grupos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar grupos" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const grupoParaAtualizar = { ...req.body };
  delete grupoParaAtualizar._id;
  try {
    const updatedGrupo = await Grupo.findByIdAndUpdate(
      req.params.id,
      grupoParaAtualizar,
      {
        new: true,
      }
    );
    if (!updatedGrupo) {
      return res.status(404).json({ message: "Grupo não encontrado" });
    }
    res.json(updatedGrupo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar grupo" });
  }
});

module.exports = router;
