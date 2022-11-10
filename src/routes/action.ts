import express, { Request, Response } from "express";
import * as actionController from "../controllers/action.controller";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  //este endpoint permite crear una nueva acción
  await actionController.createAction(req, res);
});

export default router;
