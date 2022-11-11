import express, { Request, Response } from "express";
import * as JWTVerifyToken from "../config/tokenMiddleware";
import * as adminController from "../controllers/admin.controller";
import * as actionController from "../controllers/action.controller";

const router = express.Router();
//http://localhost:4000/adminRole

// ACTION: UpdateRole
// METHOD: PATCH
//http://localhost:4000/admin/adminRole/updateRole
router.patch(
  "/adminRole/updateRole",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await adminController.updateRole(req, res);
  }
);

// ACTION: GetActions
// METHOD: GET
//http://localhost:4000/admin/adminRole/readAction
router.get(
  "/adminRole/readAction",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todas las acciones con autentificacion de usuario.
    await actionController.readAction(req, res);
  }
);

export default router;
