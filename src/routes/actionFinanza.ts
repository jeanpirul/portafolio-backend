import express, { Request, Response } from "express";
import * as actionFinanzaCTRL from "../controllers/actionFinanza.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/actionFinanza/create/createActionFinanza
router.post(
  "/create/createActionFinanza",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esFinanza],
  async (req: Request, res: Response) => {
    //este endpoint permite crear una nueva acción
    await actionFinanzaCTRL.createActionFinanza(req, res);
  }
);

export default router;
