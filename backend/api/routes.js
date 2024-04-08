const express = require("express");
const router = express.Router();

const routePath = "./routes";

const itensRouter = require(routePath + "/itens");
const gruposRouter = require(routePath + "/grupos");
const eventosRouter = require(routePath + "/eventos");
const listaDeAjudaRouter = require(routePath + "/listaDeAjuda");
const usersRouter = require(routePath + "/users");

router.use("/api/itens", itensRouter);
router.use("/api/listaDeAjuda", listaDeAjudaRouter);
router.use("/", usersRouter);
router.use("/api/eventos", eventosRouter);
router.use("/api/grupos", gruposRouter);

module.exports = router;
