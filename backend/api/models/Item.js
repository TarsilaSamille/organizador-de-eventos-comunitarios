const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
  categoria: String,
  descricao: String,
  quantidade: Number,
  precoUnitario: Number,
  grupoId: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
