const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({
  nome: String,
  nomeDoOrganizador: String,
  descricao: String,
  telefoneDoOrganizador: String,
  pixDoEvento: String,
  enderecoParaEntrega: String,
  dataLimiteParaEntrega: Date,
  quantidadeGruposParticipantes: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Evento = mongoose.model("Evento", eventoSchema);

module.exports = Evento;
