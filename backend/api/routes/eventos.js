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

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(userId, req.session);
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
    const { id } = req.params;
    const { body } = req;

    validarQuantidadeGrupos(body.quantidadeGruposParticipantes);

    const updatedEvento = await atualizarEvento(id, body);

    await atualizarGruposParticipantes(
      id,
      updatedEvento.quantidadeGruposParticipantes
    );

    res.json(updatedEvento);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar evento", error: error.message });
  }
});

async function validarQuantidadeGrupos(quantidadeGruposParticipantes) {
  if (!quantidadeGruposParticipantes || quantidadeGruposParticipantes < 0) {
    throw new Error("Quantidade de grupos participantes inválida");
  }
}

async function atualizarEvento(id, body) {
  const updatedEvento = await Evento.findByIdAndUpdate(id, body, { new: true });
  if (!updatedEvento) {
    throw new Error("Evento não encontrado");
  }
  return updatedEvento;
}

async function atualizarGruposParticipantes(eventoId, novaQuantidade) {
  const gruposAtuais = await Grupo.find({ eventoId });
  const quantidadeGruposAtuais = gruposAtuais.length;

  if (novaQuantidade > quantidadeGruposAtuais) {
    await adicionarNovosGrupos(
      eventoId,
      quantidadeGruposAtuais,
      novaQuantidade
    );
  } else if (novaQuantidade < quantidadeGruposAtuais) {
    await removerGruposExcedentes(gruposAtuais, novaQuantidade);
  }
}

async function adicionarNovosGrupos(eventoId, quantidadeAtual, novaQuantidade) {
  const novosGrupos = [];
  for (let i = quantidadeAtual; i < novaQuantidade; i++) {
    novosGrupos.push({
      nome: `Grupo ${i + 1}`,
      eventoId,
    });
  }
  await Grupo.insertMany(novosGrupos);
}

async function removerGruposExcedentes(grupos, novaQuantidade) {
  const gruposParaExcluir = grupos.slice(novaQuantidade);
  await Grupo.deleteMany({
    _id: { $in: gruposParaExcluir.map((grupo) => grupo._id) },
  });
}

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
      const eventoId = req.params.eventoId;

      validarEventoId(eventoId);

      await adicionarItensPadrao(eventoId);
      await criarEntradasListaAjuda(eventoId);

      res.status(201).json({ message: "Evento padrão adicionado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao adicionar evento padrão" });
    }
  }
);

function validarEventoId(eventoId) {
  if (!eventoId) {
    throw new Error("ID do evento não fornecido");
  }
}

async function adicionarItensPadrao(eventoId) {
  const itemsWithEventoId = defaultItems.map((item) => ({ ...item, eventoId }));
  await Item.insertMany(itemsWithEventoId);
}

async function criarEntradasListaAjuda(eventoId) {
  for (const item of defaultItems) {
    const listaDeAjudaEntries = [];
    for (let i = 1; i <= item.quantidade; i++) {
      listaDeAjudaEntries.push({
        item: `${item.descricao} (${i})`,
        preco: item.precoUnitario,
        eventoId,
      });
    }
    await ListaDeAjuda.insertMany(listaDeAjudaEntries);
  }
}

module.exports = router;
