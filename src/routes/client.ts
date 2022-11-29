import express, { Request, Response } from 'express';
import * as clientController from '../controllers/client.controller';
import * as pedidoController from '../controllers/pedido.controller';
import * as JWTVerifyToken from '../config/tokenMiddleware';

const router = express.Router();
//http://localhost:4000/client

// ACTION: GetClient
// METHOD: GET
//http://localhost:4000/client/clientRole/crearPedido/
router.post(
  '/clientRole/crearPedido/',
  // [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite generar nuevos pedidos por parte del cliente
    await pedidoController.crearPedido(req, res);
  }
);

// ACTION: Listar todos los platos
// METHOD: POST
//http://localhost:4000/client/cocinaRole/nuevoPlato/
router.post(
  '/cocinaRole/nuevoPlato/',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCocina],
  async (req: Request, res: Response) => {
    //Este endpoint permite generar nuevos pedidos por parte del cliente
    await pedidoController.nuevoPlato(req, res);
  }
);

// ACTION: nueov plato
// METHOD: GET
//http://localhost:4000/client/getPlatos
router.get('/getPlatos', async (req: Request, res: Response) => {
  //Este endpoint permite generar nuevos pedidos por parte del cliente
  await pedidoController.getPlatos(req, res);
});

// ACTION: Listar platos by id plato
// METHOD: GET
//http://localhost:4000/client/getPlatosById/idPlato
router.get('/getPlatosById/:idPlato', async (req: Request, res: Response) => {
  //Este endpoint permite generar nuevos pedidos por parte del cliente
  await pedidoController.getPlatoById(req, res);
});

// ACTION: GetClient
// METHOD: GET
//http://localhost:4000/client/clientRole/updateCantidad/
router.patch(
  '/clientRole/updateCantidad/',
  // [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar la cantidad de productos.
    await pedidoController.updateCantidad(req, res);
  }
);

// ACTION: GetClient
// METHOD: GET
//http://localhost:4000/client/adminRole/getClients/
router.get(
  '/adminRole/getClients',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los clientes existentes en la base de datos
    await clientController.getClients(req, res);
  }
);

// ACTION: Getid
// METHOD: GET
//http://localhost:4000/client/adminRole/getClientByEmail/:idUser
router.get(
  '/adminRole/getClientByEmail/:idUser',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await clientController.getClientByEmail(req, res);
  }
);

export default router;
