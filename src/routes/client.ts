import express, { Request, Response } from "express";
import * as clientController from "../controllers/client.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();

router.get(
  "/adminRole/getClient/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los clientes existentes en la base de datos
    await clientController.getClient(req, res);
  }
);

router.get(
  "/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await clientController.getClientById(req, res);
  }
);

router.delete(
  "/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada cliente existente en la base de datos segun el id */
    await clientController.deleteClient(req, res);
  }
);

export default router;
