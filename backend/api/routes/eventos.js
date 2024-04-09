const express = require("express");
const router = express.Router();

const Evento = require("../models/Evento");
const Grupo = require("../models/Grupo");
const Item = require("../models/Item");
const ListaDeAjuda = require("../models/ListaDeAjuda");

const authenticateToken = require("./utils");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const novoEvento = new Evento(req.body);
    await novoEvento.save();

    for (let i = 0; i < novoEvento.quantidadeGruposParticipantes; i++) {
      const novoGrupo = new Grupo({
        nome: `Grupo ${i + 1}`,
        eventoId: novoEvento._id,
      });
      await novoGrupo.save();
    }

    res.status(201).json(novoEvento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar evento" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

router.get("/all/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventos = await Evento.find({ userId });
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.json(evento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar evento" });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const eventoId = req.params.id;
    const updatedEvento = await Evento.findByIdAndUpdate(eventoId, req.body, {
      new: true,
    });

    if (!updatedEvento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    const gruposAtuais = await Grupo.find({ eventoId: eventoId });
    const quantidadeGruposAtuais = gruposAtuais.length;

    if (updatedEvento.quantidadeGruposParticipantes > quantidadeGruposAtuais) {
      for (
        let i = quantidadeGruposAtuais;
        i < updatedEvento.quantidadeGruposParticipantes;
        i++
      ) {
        const novoGrupo = new Grupo({
          nome: `Grupo ${i + 1}`,
          eventoId: eventoId,
        });
        await novoGrupo.save();
      }
    } else if (
      updatedEvento.quantidadeGruposParticipantes < quantidadeGruposAtuais
    ) {
      const gruposParaExcluir = gruposAtuais.slice(
        updatedEvento.quantidadeGruposParticipantes
      );
      await Grupo.deleteMany({
        _id: { $in: gruposParaExcluir.map((grupo) => grupo._id) },
      });
    }

    res.json(updatedEvento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar evento" });
  }
});
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedEvento = await Evento.findByIdAndDelete(req.params.id);
    if (!deletedEvento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.json(deletedEvento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar evento" });
  }
});

const { items: defaultItems } = require("../seed");

router.post(
  "/adicionarEventoPadrao/:eventoId",
  authenticateToken,
  async (req, res) => {
    try {
      const eventoId = req.params.eventoId; // Get the eventoId from the request parameters

      const itemsWithEventoId = defaultItems.map((item) => ({
        ...item,
        eventoId: eventoId, // Include the eventoId in each item
      }));

      await Item.insertMany(itemsWithEventoId);

      for (const item of defaultItems) {
        for (let i = 1; i <= item.quantidade; i++) {
          const listaDeAjudaEntry = new ListaDeAjuda({
            item: `${item.descricao} (${i})`,
            preco: item.precoUnitario,
            eventoId,
          });
          await listaDeAjudaEntry.save();
        }
      }

      res.status(201).json({ message: "Evento padrão adicionada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao adicionar evento padrão" });
    }
  }
);

module.exports = router;
