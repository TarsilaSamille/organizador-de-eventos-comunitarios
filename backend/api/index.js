const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb://localhost:27017/eventos-comunitarios`;
// String de conexão com o MongoDB Atlas
// const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3s7ir2u.mongodb.net/eventos-comunitarios?retryWrites=true&w=majority&authSource=admin`;

// Conectar ao MongoDB usando o Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
