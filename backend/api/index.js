const express = require("express");

const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// const uri = `mongodb://localhost:27017/eventos-comunitarios`;
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3s7ir2u.mongodb.net/eventos-comunitarios?retryWrites=true&w=majority&authSource=admin`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const session = require("express-session");

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const frontOrigin = `${process.env.FRONT_ORIGIN}`;
const cors = require("cors");
app.use(
  cors({
    origin: frontOrigin,
    credentials: true,
  })
);

const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
