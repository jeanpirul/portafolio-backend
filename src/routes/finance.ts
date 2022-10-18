import express from "express";
import * as financeController from "../controllers/finance.controller";

const router = express.Router();

router.post("/", async (req, res) => {
  //este endpoint permite crear un nuevo financee
  await financeController.createFinance(req, res);
});

router.get("/", async (req, res) => {
  //Este endpoint permite listar todos los financees existentes en la base de datos
  await financeController.getFinance(req, res);
});

router.get("/:id", async (req, res) => {
  //Este endpoint permite listar 1 financere existente en la base de datos por el ID
  await financeController.getFinanceById(req, res);
});

router.put("/", async (req, res) => {
  //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
  await financeController.updateFinance(req, res);
});

router.delete("/:id", async (req, res) => {
  /* Este endpoint permite eliminar los datos de cada 
	financee existente en la base de datos segun el id */
  await financeController.deleteFinance(req, res);
});

export default router;
