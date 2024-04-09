const mongoose = require("mongoose");

const listaDeAjudaSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
  item: String,
  preco: Number,
  nomeDoDoador: String,
  telefone: String,
  metodoPagamentoOuEntrega: String,
  statusEntrega: Boolean,
  grupoId: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
});

const ListaDeAjuda = mongoose.model("ListaDeAjuda", listaDeAjudaSchema);

module.exports = ListaDeAjuda;
