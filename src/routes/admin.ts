import express, { Request, Response } from 'express';
import * as JWTVerifyToken from '../config/tokenMiddleware';
import * as adminController from '../controllers/admin.controller';
import * as actionController from '../controllers/action.controller';
import * as clientController from '../controllers/client.controller';

const router = express.Router();
//http://localhost:4000/adminRole

// ACTION: UpdateRole
// METHOD: PATCH
//http://localhost:4000/adminRole/updateRole
router.patch(
  '/updateRole',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await adminController.updateRole(req, res);
  }
);

// ACTION: GetActions
// METHOD: GET
//http://localhost:4000/adminRole/readAction
router.get(
  '/readAction',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //este endpoint permite listar todas las acciones con autentificacion de usuario.
    await actionController.readAction(req, res);
  }
);

// ACTION: GetUserByEmail
// METHOD: GET
//http://localhost:4000/adminRole/getUserByEmail/:email
router.get(
  '/getUserByEmail/:email',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 clientre existente en la base de datos por el ID
    await adminController.getUserByEmail(req, res);
  }
);

// ACTION: deleteUserByEmail
// METHOD: delete
//http://localhost:4000/adminRole/deleteUserByEmail/:email
router.delete(
  '/deleteUserByEmail/:email',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada cliente existente en la base de datos segun el id */
    await clientController.deleteUserByEmail(req, res);
  }
);
export default router;
