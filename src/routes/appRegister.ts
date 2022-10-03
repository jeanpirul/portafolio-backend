import express from "express";
import { verifyToken } from "../config/tokenMiddleware";
import { login } from "../controllers/login.controller";
import { admin } from "../entities_DB/admin";

const router = express.Router();

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await login(req, res);
});

router.get("/client/:id/ventas", verifyToken, (req, res) => {
  res.json(admin);
});

// router.get("/client/:id/ventas", (req, res) => {
//   res.json(admin);
// });

export default router;
