import express from "express";
import * as clientController from "../controllers/client.controller";

const router = express.Router();

router.post("/", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await clientController.createClient(req, res);
});

router.get("/", async (req, res) => {
  //Este endpoint permite listar todos los clientes existentes en la base de datos
  await clientController.getClient(req, res);
});

router.get("/:id", async (req, res) => {
  //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
  await clientController.getClientById(req, res);
});

router.patch("/", async (req, res) => {
  //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
  await clientController.updateClient(req, res);
});

router.delete("/:id", async (req, res) => {
  /* Este endpoint permite eliminar los datos de cada cliente existente en la base de datos segun el id */
  await clientController.deleteClient(req, res);
});

export default router;
