const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para analisar corpos JSON
app.use(cors());
app.use(express.json());

// String de conexão com o MongoDB Atlas
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3s7ir2u.mongodb.net/eventos-comunitarios?retryWrites=true&w=majority&authSource=admin`;

// Conectar ao MongoDB usando o Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const User = require("./models/User"); // Não é necessário se você não estiver usando Mongoose

app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(500).send({ message: "Error registering user", error });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user)
    return res.status(401).send({ message: "Invalid username or password" });

  user.comparePassword(password, function (err, isMatch) {
    if (!isMatch)
      return res.status(401).send({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Schema e modelo para os itens dos eventos-comunitarios
const itemSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
  categoria: String,
  descricao: String,
  quantidade: Number,
  precoUnitario: Number,
  grupoId: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
});

const Item = mongoose.model("Item", itemSchema);

// Rotas para manipulação dos itens
app.get("/api/itens", authenticateToken, async (req, res) => {
  try {
    const itens = await Item.find();
    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar itens" });
  }
});

app.get("/api/itens/:eventoId", authenticateToken, async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const itens = await Item.find({ eventoId });
    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar itens" });
  }
});

const ListaDeAjuda = require("./ListaDeAjuda"); // Adjust the path as necessary

app.post("/api/itens", authenticateToken, async (req, res) => {
  const novoItem = new Item(req.body);
  try {
    await novoItem.save();
    for (let i = 1; i <= novoItem.quantidade; i++) {
      const listaDeAjudaEntry = new ListaDeAjuda({
        item: `${novoItem.descricao} (${i})`,
        preco: novoItem.precoUnitario,
        nomeDoIrmao: `Nome do Irmão ${i}`, // Placeholder, adjust as necessary
        metodoPagamentoOuEntrega: "Pix ou entregar na data X no endereço Y", // Placeholder
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

app.delete("/api/itens/:id", authenticateToken, async (req, res) => {
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

app.put("/api/itens/:id", authenticateToken, async (req, res) => {
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

app.get("/api/listaDeAjuda", authenticateToken, async (req, res) => {
  try {
    const listaDeAjuda = await ListaDeAjuda.find();
    res.json(listaDeAjuda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar lista de ajuda" });
  }
});

// In your server.js or the relevant file
app.get(
  "/api/listaDeAjuda/:eventoId/:grupoId?",
  authenticateToken,
  async (req, res) => {
    const { eventoId, grupoId } = req.params;
    try {
      let query = { eventoId };
      if (grupoId) {
        query.grupoId = grupoId;
      }
      const listaDeAjuda = await ListaDeAjuda.find(query);
      res.json(listaDeAjuda);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar lista de ajuda" });
    }
  }
);

// server.js

const { items: defaultItems } = require("./seed");

app.post(
  "/api/adicionarEventoPadrao/:eventoId",
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

app.post("/api/listaDeAjuda", authenticateToken, async (req, res) => {
  try {
    const newItem = new ListaDeAjuda(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar item" });
  }
});

app.post("/api/atualizarItens", authenticateToken, async (req, res) => {
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

app.put("/api/listaDeAjuda/:id", authenticateToken, async (req, res) => {
  try {
    const updatedItem = await ListaDeAjuda.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // This option returns the updated document
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

app.delete("/api/listaDeAjuda/all", authenticateToken, async (req, res) => {
  try {
    await ListaDeAjuda.deleteMany({}); // This deletes all documents in the collection
    res.json({ message: "All items deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting all items" });
  }
});

app.delete("/api/listaDeAjuda/:id", authenticateToken, async (req, res) => {
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

app.post(
  "/api/generateListaDeAjudaForAll/:eventoId",
  authenticateToken,
  async (req, res) => {
    try {
      const items = await Item.find({ eventoId: req.params.eventoId });
      const grupos = await Grupo.find({ eventoId: req.params.eventoId });

      if (items.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum item encontrado para o evento fornecido" });
      }

      if (grupos.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum grupo encontrado para o evento fornecido" });
      }

      const totalValueItems = items.reduce(
        (total, item) => total + item.precoUnitario * item.quantidade,
        0
      );

      if (isNaN(totalValueItems) || totalValueItems <= 0) {
        return res.status(400).json({
          message: "Valor total dos itens inválido ou não disponível",
        });
      }

      console.log(totalValueItems);
      const totalGroups = grupos.length;
      const valuePerGroup = totalValueItems / totalGroups;
      let assignedValue = 0;
      let gruposIndex = 0; // Start index from 0

      // Use a for...of loop to iterate over items
      for (const item of items) {
        for (let i = 1; i <= item.quantidade; i++) {
          if (assignedValue >= valuePerGroup && gruposIndex < grupos.length) {
            assignedValue = 0;
            gruposIndex++;
          }
          const listaDeAjudaEntry = new ListaDeAjuda({
            item: `${item.descricao} (${i})`,
            preco: item.precoUnitario,
            eventoId: req.params.eventoId,
            grupoId: grupos[gruposIndex]._id,
            statusEntrega: false,
          });
          // Await the save operation to ensure it completes before moving to the next item
          await listaDeAjudaEntry.save();
          assignedValue += item.precoUnitario; // Assuming you meant to add item.precoUnitario instead of item.valor
        }
      }

      console.log("All items processed");

      const listaDeAjuda = await ListaDeAjuda.find({
        eventoId: req.params.eventoId,
      });

      res.json({
        message: "Lista de Ajuda gerada com sucesso para todos os itens",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erro ao gerar Lista de Ajuda para todos os itens" });
    }
  }
);

const Evento = require("./models/Evento");

app.post("/api/eventos", authenticateToken, async (req, res) => {
  try {
    const novoEvento = new Evento(req.body);
    await novoEvento.save();

    // Criar grupos vazios com base na quantidade especificada
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

app.get("/api/eventos", authenticateToken, async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

app.get("/api/eventos/all/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventos = await Evento.find({ userId });
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

("/eventos/all/");

app.get("/api/eventos/:id", authenticateToken, async (req, res) => {
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
app.put("/api/eventos/:id", authenticateToken, async (req, res) => {
  try {
    const eventoId = req.params.id;
    const updatedEvento = await Evento.findByIdAndUpdate(eventoId, req.body, {
      new: true,
    });

    if (!updatedEvento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    // Obter a quantidade atual de grupos
    const gruposAtuais = await Grupo.find({ eventoId: eventoId });
    const quantidadeGruposAtuais = gruposAtuais.length;

    // Se a nova quantidade for maior, adicionar grupos
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
app.delete("/api/eventos/:id", authenticateToken, async (req, res) => {
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

const Grupo = require("./Grupo");

app.post("/api/grupos", authenticateToken, async (req, res) => {
  try {
    const novoGrupo = new Grupo(req.body);
    await novoGrupo.save();
    res.status(201).json(novoGrupo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar grupo" });
  }
});

app.get("/api/grupos/:eventoId", authenticateToken, async (req, res) => {
  try {
    const grupos = await Grupo.find({ eventoId: req.params.eventoId });
    res.json(grupos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar grupos" });
  }
});

app.put("/api/grupos/:id", authenticateToken, async (req, res) => {
  const grupoParaAtualizar = { ...req.body }; // Supondo que req.body contém o objeto a ser atualizado
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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = { Item };
