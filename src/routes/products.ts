import { Router } from "express";
import { verifyToken } from "../config/tokenMiddleware";
import * as productCtrl from "../controllers/product.controller";

const router: Router = Router();

router.post("/", verifyToken, async (req, res) => {
  //este endpoint permite crear un nuevo producto
  await productCtrl.createProduct(req, res);
});

router.get("/", async (req, res) => {
  //este endpoint permite listar todos productos disponibles.
  //   await actionController.readAction(req, res);
  await productCtrl.getProduct;
});

router.patch("/:id", async (req, res) => {
  //Este endpoint permite actualizar los datos de cada producto existente en la base de datos
  await productCtrl.updateProduct(req, res);
});

router.delete("/:id", async (req, res) => {
  /* Este endpoint permite eliminar los productos existentes en la base de datos segun el id */
  await productCtrl.deleteProduct(req, res);
});

export default router;
