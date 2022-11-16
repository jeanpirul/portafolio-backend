import express from "express";
import { routes } from "./routes/index";

export const router = express.Router();

router.use("/client", routes.client);
router.use("/finance", routes.finance);
router.use("/auth", routes.appRegister);
router.use("/action", routes.action);
router.use("/bodega", routes.bodega);
router.use("/user", routes.user);
router.use("/adminRole", routes.admin);
router.use("/actionBodega", routes.actionBodega);
router.use("/actionFinanza", routes.actionFinanza);
router.use("/", routes.root);
