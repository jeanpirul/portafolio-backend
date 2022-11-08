import express, { Request, Response } from "express";
import { login } from "../controllers/login.controller";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.post("/register/", async (req: Request, res: Response) => {
  //este endpoint permite crear un nuevo usere
  await userController.createUser(req, res);
});

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo usuario
  await login(req, res);
});

export default router;
