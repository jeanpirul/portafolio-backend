import express, { Request, Response } from "express";
import * as financeController from "../controllers/finance.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();

router.post(
  "/finance/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //este endpoint permite crear un nuevo financee
    await financeController.createFinance(req, res);
  }
);

router.get(
  "/finance/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los financees existentes en la base de datos
    await financeController.getFinance(req, res);
  }
);

router.get(
  "/finance/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 financere existente en la base de datos por el ID
    await financeController.getFinanceById(req, res);
  }
);

router.put(
  "/finance/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await financeController.updateFinance(req, res);
  }
);

router.delete(
  "/finance/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada 
	financee existente en la base de datos segun el id */
    await financeController.deleteFinance(req, res);
  }
);

export default router;
