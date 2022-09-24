import { Router } from "express";
import * as actionController from "../controllers/action.controller";

const router: Router = Router();

router.post("/create", async (req, res) => {
  //este endpoint permite crear una nueva acción
  await actionController.createAction(req, res);
});
export default router;
