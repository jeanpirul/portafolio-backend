import express, { Request, Response } from 'express';
import * as actionClienteCTRL from '../controllers/actionCliente.controller';
import * as JWTVerifyToken from '../config/tokenMiddleware';

const router = express.Router();

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/actionCliente/create/createActionCliente
router.post(
  '/create/createActionCliente',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCliente],
  async (req: Request, res: Response) => {
    //este endpoint permite crear una nueva acción
    await actionClienteCTRL.createActionCliente(req, res);
  }
);

export default router;
