import express, { Request, Response } from 'express';
import * as userController from '../controllers/user.controller';
import * as JWTVerifyToken from '../config/tokenMiddleware';

const router = express.Router();
//http://localhost:4000/user

// ACTION: adminRole
// METHOD: GET
//http://localhost:4000/user/adminRole/getUser
router.get(
  '/adminRole/getUser',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar todos los useres existentes en la base de datos
    await userController.getUser(req, res);
  }
);

// ACTION: adminRole
// METHOD: GET
//http://localhost:4000/user/adminRole/getUserById/
router.get(
  '/adminRole/getUserById/:id',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    //Este endpoint permite listar 1 userre existente en la base de datos por el ID
    await userController.getUserById(req, res);
  }
);

// ACTION: adminRole
// METHOD: PATCH
//http://localhost:4000/user/clientRole/updatePassword
router.patch(
  '/clientRole/updatePassword',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esCliente],
  async (req: Request, res: Response) => {
    //Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
    await userController.updatePassword(req, res);
  }
);

// ACTION: adminRole
// METHOD: DELETE
//http://localhost:4000/user/adminRole/deleteUser/
router.delete(
  'adminRole/deleteUser/:id',
  [JWTVerifyToken.verifyToken, JWTVerifyToken.esAdmin],
  async (req: Request, res: Response) => {
    /* Este endpoint permite eliminar los datos de cada usere existente en la base de datos segun el id */
    await userController.deleteUser(req, res);
  }
);

export default router;
