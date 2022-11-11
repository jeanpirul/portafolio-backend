import express, { Request, Response } from "express";
import * as productCtrl from "../controllers/product.controller";
import * as JWTVerifyToken from "../config/tokenMiddleware";

const router = express.Router();
//http://localhost:4000/products

// ACTION: BodegaRole
// METHOD: POST
router.post(
  "localhost:4000/products/bodegaRole",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //este endpoint permite crear un nuevo producto
    await productCtrl.createProduct(req, res);
  }
);

// ACTION: BodegaRole
// METHOD: GET
router.get(
  "localhost:4000/products/bodegaRole",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todos productos disponibles.
    //   await actionController.readAction(req, res);
    await productCtrl.getProduct(req, res);
  }
);

// ACTION: BodegaRole
// METHOD: PATCh
router.patch(
  "localhost:4000/products/bodegaRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada producto existente en la base de datos
    await productCtrl.updateProduct(req, res);
  }
);

// ACTION: BodegaRole
// METHOD: DELETE
router.delete(
  "localhost:4000/products/bodegaRole/:id",
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esBodega],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los productos existentes en la base de datos segun el id */
    await productCtrl.deleteProduct(req, res);
  }
);

export default router;
