import express, { Request, Response } from "express";
import * as actionCocinaCTRL from "../controllers/actionCocina.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/actionCocina/create/createActionCocina
router.post(
  "/create/createActionCocina",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCocina],
  async (req: Request, res: Response) => {
    //este endpoint permite crear una nueva acción
    await actionCocinaCTRL.createActionCocina(req, res);
  }
);

export default router;
