import express from "express";
import { login } from "../controllers/login.controller";
import { register } from "../controllers/register.controller";

const router = express.Router();

router.post("/register", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await register(req, res);
});

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await login(req, res);
});

export default router;
