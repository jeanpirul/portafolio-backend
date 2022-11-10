import express, { Request, Response } from "express";
import * as productCtrl from "../controllers/product.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/products

router.post(
  "/bodegaRole/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //este endpoint permite crear un nuevo producto
    await productCtrl.createProduct(req, res);
  }
);

router.get(
  "/bodegaRole/",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todos productos disponibles.
    //   await actionController.readAction(req, res);
    await productCtrl.getProduct(req, res);
  }
);

router.patch(
  "/bodegaRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada producto existente en la base de datos
    await productCtrl.updateProduct(req, res);
  }
);

router.delete(
  "/bodegaRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los productos existentes en la base de datos segun el id */
    await productCtrl.deleteProduct(req, res);
  }
);

export default router;
