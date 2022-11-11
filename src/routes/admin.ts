import express, { Request, Response } from "express";
import * as JWTVerifyToken from "../config/tokenMiddleware";
import * as adminController from "../controllers/admin.controller";
import * as actionController from "../controllers/action.controller";
import * as clientController from "../controllers/client.controller";

const router = express.Router();
//http://localhost:4000/admin

router.patch(
  "/updateRole/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await adminController.updateRole(req, res);
  }
);

router.get(
  "/getActions/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todas las acciones con autentificacion de usuario.
    await actionController.readAction(req, res);
  }
);

router.get(
  "/adminRole/email/:email",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await adminController.getUserByEmail(req, res);
  }
);

router.delete(
  "/adminRole/:email",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada cliente existente en la base de datos segun el id */
    await clientController.deleteUserByEmail(req, res);
  }
);
export default router;
