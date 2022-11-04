import express from "express";
import { error } from "../config/responseApi";
import { verifyToken } from "../config/tokenMiddleware";
import { login } from "../controllers/login.controller";

const router = express.Router();

router.post("/login", async (req, res) => {
  //este endpoint permite crear un nuevo cliente
  await login(req, res);
});

router.get("/client/:id/ventas", verifyToken, async (req, res) => {
  try {
    // res.json(admin);
  } catch (err) {
    res.status(400).json(await error(res.statusCode));
  }
});

// router.get("/client/:id/ventas", (req, res) => {
//   res.json(admin);
// });

export default router;
