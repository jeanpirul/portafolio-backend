import express, { Request, Response } from "express";
import * as clientController from "../controllers/client.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/client

// ACTION: GetClient
// METHOD: GET
router.get(
  "localhost:4000/client/adminRole/getClient",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los clientes existentes en la base de datos
    await clientController.getClient(req, res);
  }
);

// ACTION: Getid
// METHOD: GET
router.get(
  "localhost:4000/client/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await clientController.getClientById(req, res);
  }
);

// ACTION: DELETE by ID
// METHOD: DELETE
router.delete(
  "localhost:4000/client/adminRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada cliente existente en la base de datos segun el id */
    await clientController.deleteClient(req, res);
  }
);

export default router;
