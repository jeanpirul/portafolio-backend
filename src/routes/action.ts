import express, { Request, Response } from "express";
import * as actionController from "../controllers/action.controller";

const router = express.Router();
//http://localhost:4000/action/create

// ACTION: CREATE
// METHOD: POST
//http://localhost:4000/action/create/createAction
router.post("/create", async (req: Request, res: Response) => {
  //este endpoint permite crear una nueva acción
  await actionController.createAction(req, res);
});

export default router;
