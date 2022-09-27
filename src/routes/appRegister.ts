import express from "express";
import { login } from "../controllers/login.controller";

const router = express.Router();

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await login(req, res);
});

export default router;
