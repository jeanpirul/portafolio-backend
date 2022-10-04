import { Router } from "express";
import { verifyToken } from "../config/tokenMiddleware";
import * as actionController from "../controllers/action.controller";

const router: Router = Router();

router.post("/create", async (req, res) => {
  //este endpoint permite crear una nueva acción
  await actionController.createAction(req, res);
});

router.get("/", verifyToken, async (req, res) => {
  //este endpoint permite listar todas las acciones con autentificacion de usuario.
  await actionController.readAction(req, res);
});

export default router;
