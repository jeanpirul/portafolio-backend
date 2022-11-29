import express, { Request, Response } from 'express';
import * as actionPedidoCTRL from '../controllers/actionPedido.controller';
import * as JWTVerifyToken from '../config/tokenMiddleware';

const router = express.Router();

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/actionPedido/create/createActionPedido
router.post(
  '/create/createActionPedido',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCliente],
  async (req: Request, res: Response) => {
    //este endpoint permite crear una nueva acción
    await actionPedidoCTRL.createActionPedido(req, res);
  }
);

export default router;
