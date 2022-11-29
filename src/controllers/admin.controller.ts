import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { insertBitacora } from './action.controller';
import { connectDB } from '../config/config';
import { User } from '../entities_DB/user';
import { Rol } from '../entities_DB/rol';
import * as jwt from 'jsonwebtoken';

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    if (!email) return res.status(404).json(await error(res.statusCode));

    const userFound = await User.findOneBy({
      email: email,
    });

    !userFound
      ? res
          .status(404)
          .json({ message: 'Usuario no existe en la base de datos' })
      : res.json({ listClient: userFound });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    console.log('Se ha solicitado una actualización del rol del User.');
    const { email, fk_Rol } = req.body;

    if (!email || !fk_Rol)
      return res
        .status(400)
        .json({ message: `Parámetro ${email} y/o rol  no ingresado` });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );
    const userExist: any = await User.findOneBy({
      email: email,
    });

    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (!userExist) {
      return res.status(404).json({
        error: 'Usuario no existe para actualizar.',
      });
    } else if (userExist) {
      const result = await User.update(userExist, { fk_Rol: fk_Rol });
      const getRol = await Rol.findOneBy({ idRol: fk_Rol });
      const rolAdmin = await Rol.findOneBy({ idRol: decodedToken.idRol });

      if (result) {
        await insertBitacora({
          nameTableAction: 'user',
          nameRole: rolAdmin?.nameRol,
          idUser: userExist.idUser,
          userName: userExist.email,
          actionDetail: `El Administrador ${decodedToken.email} actualizó el rol del usuario: ${userExist.email} a "${getRol?.nameRol}" `,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
    // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};
