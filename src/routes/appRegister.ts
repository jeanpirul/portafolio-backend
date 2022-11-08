import { login } from "../controllers/login.controller";
import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo usuario
  await login(req, res);
});

export default router;
