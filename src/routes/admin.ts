import express, { Request, Response } from "express";
import * as JWTVerifyToken from "../config/tokenMiddleware";
import * as adminController from "../controllers/admin.controller";
import * as actionController from "../controllers/action.controller";

const router = express.Router();
//http://localhost:4000/admin

// ACTION: UpdateRole
// METHOD: PATCH
router.patch(
  "localhost:4000/admin/updateRole",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await adminController.updateRole(req, res);
  }
);

// ACTION: GetActions
// METHOD: GET
router.get(
  "localhost:4000/admin/getActions",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todas las acciones con autentificacion de usuario.
    await actionController.readAction(req, res);
  }
);

export default router;
