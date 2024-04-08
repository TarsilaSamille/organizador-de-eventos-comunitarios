const mongoose = require("mongoose");

const grupoSchema = new mongoose.Schema({
  nome: String,
  cor: { type: String, default: "#FFFFFF" }, // Adicione esta linha
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
});

const Grupo = mongoose.model("Grupo", grupoSchema);
module.exports = Grupo;
