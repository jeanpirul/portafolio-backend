import express, { Request, Response } from "express";
import * as clientController from "../controllers/client.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/client

// ACTION: GetClient
// METHOD: GET
//http://localhost:4000/client/adminRole/getClients/
router.get(
  "/adminRole/getClients",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los clientes existentes en la base de datos
    await clientController.getClient(req, res);
  }
);

// ACTION: Getid
// METHOD: GET
//http://localhost:4000/client/adminRole/getClientById/:idUser
router.get(
  "/adminRole/getClientById/:idUser",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await clientController.getClientById(req, res);
  }
);

export default router;
