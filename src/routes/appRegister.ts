import express, { Request, Response } from 'express';
import { login } from '../controllers/login.controller';
import * as userController from '../controllers/user.controller';

const router = express.Router();
//http://localhost:4000/auth

// ACTION: REGISTERf
// METHOD: POST
//http://localhost:4000/auth/register/createUser
router.post('/register/createUser', async (req: Request, res: Response) => {
  //este endpoint permite crear un nuevo usere
  await userController.createUser(req, res);
});

// ACTION: LOGIN
// METHOD: POST
//http://localhost:4000/auth/login
router.post('/login', async (req, res) => {
  //este endpoint permite crear un nuevo usuario
  await login(req, res);
});

export default router;
