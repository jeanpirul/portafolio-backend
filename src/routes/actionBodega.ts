import express, { Request, Response } from "express";
import * as actionBodegaCTRL from "../controllers/actionBodega.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/action/create

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/actionBodega/create/createActionBodega
router.post(
  "/create/createActionBodega",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //este endpoint permite crear una nueva acción
    await actionBodegaCTRL.createActionBodega(req, res);
  }
);

export default router;
