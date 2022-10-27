import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.post("/", async (req, res) => {
  //este endpoint permite crear un nuevo usere
  await userController.createUser(req, res);
});

router.get("/", async (req, res) => {
  //Este endpoint permite listar todos los useres existentes en la base de datos
  await userController.getUser(req, res);
});

router.get("/:id", async (req, res) => {
  //Este endpoint permite listar 1 userre existente en la base de datos por el ID
  await userController.getUserById(req, res);
});

router.patch("/", async (req, res) => {
  //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
  await userController.updateUser(req, res);
});

router.delete("/:id", async (req, res) => {
  /* Este endpoint permite eliminar los datos de cada usere existente en la base de datos segun el id */
  await userController.deleteUser(req, res);
});

export default router;
