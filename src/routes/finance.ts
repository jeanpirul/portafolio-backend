import express, { Request, Response } from "express";
import * as financeController from "../controllers/finance.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/finance

// ACTION: FinanceRole
// METHOD: POST
//http://localhost:4000/finance/financeRole/createFinance
router.post(
  "/financeRole/createFinance",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //este endpoint permite crear un nuevo financee
    await financeController.createFinance(req, res);
  }
);

// ACTION: FinanceRole
// METHOD: GET
//http://localhost:4000/finance/financeRole/getFinance
router.get(
  "/financeRole/getFinance",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los financees existentes en la base de datos
    await financeController.getFinance(req, res);
  }
);

// ACTION: FinanceRole
// METHOD: GET
//http://localhost:4000/finance/financeRole/getFinanceById/:idFinance
router.get(
  "/financeRole/getFinanceById/:idFinance",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 financere existente en la base de datos por el ID
    await financeController.getFinanceById(req, res);
  }
);

// ACTION: FinanceRole
// METHOD: PUT
//http://localhost:4000/finance/financeRole/updateFinance
router.put(
  "/financeRole/updateFinance",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada finanza existente en la base de datos
    await financeController.updateFinance(req, res);
  }
);

// ACTION: FinanceRole
// METHOD: DELETE
//http://localhost:4000/finance/financeRole/deleteFinance/:id
router.delete(
  "/financeRole/deleteFinance/:idFinance",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada 
	financee existente en la base de datos segun el id */
    await financeController.deleteFinance(req, res);
  }
);

export default router;
