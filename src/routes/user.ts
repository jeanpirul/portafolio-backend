import express, { Request, Response } from "express";
import * as userController from "../controllers/user.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();

router.get(
  "/adminRole/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los useres existentes en la base de datos
    await userController.getUser(req, res);
  }
);

router.get(
  "/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 userre existente en la base de datos por el ID
    await userController.getUserById(req, res);
  }
);

router.patch(
  "/clienteRole",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCliente],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await userController.updatePassword(req, res);
  }
);

router.delete(
  "/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada usere existente en la base de datos segun el id */
    await userController.deleteUser(req, res);
  }
);

export default router;
