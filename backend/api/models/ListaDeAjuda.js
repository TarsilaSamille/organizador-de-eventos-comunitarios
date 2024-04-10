const mongoose = require("mongoose");

const listaDeAjudaSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
  grupoId: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
  item: String,
  preco: Number,
  nomeDoDoador: String,
  telefone: String,
  metodoPagamentoOuEntrega: String,
  statusEntrega: Boolean,
});

const ListaDeAjuda = mongoose.model("ListaDeAjuda", listaDeAjudaSchema);

module.exports = ListaDeAjuda;
