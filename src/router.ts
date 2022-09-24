import express from "express";
import { routes } from "./routes/index";

export const router = express.Router();

router.use("/client", routes.client);
router.use("/finance", routes.finance);
router.use("/appRegister", routes.appRegister);
router.use("/createAction", routes.createAction);
router.use("/", routes.root);
