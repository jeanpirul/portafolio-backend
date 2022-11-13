import { Request, Response } from "express";
import { insertBitacora } from "./action.controller";
import { error, success } from "../config/responseApi";
import { Rol } from "../entities_DB/rol";
import { User } from "../entities_DB/user";
import { connectDB } from "../config/config";
import * as jwt from "jsonwebtoken";

export const getClient = async (req: Request, res: Response) => {
  try {
    let clientRole = 2;
    const clientFound = await Rol.query(
      `select * from public.user where "fk_Rol" = $1;`,
      [clientRole]
    );

    !clientFound
      ? res.status(404).json({ message: "No users found" })
      : res.json({ listClient: clientFound });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getClientByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(404).json(await error(res.statusCode));

    const clientFound: any = await User.findOneBy({
      email: email,
    });

    !clientFound
      ? res.status(404).json({ message: "Cliente-Usuario no encontrado" })
      : res.json({ listClient: clientFound });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    console.log("Se ha solicitado la eliminación de una entidad Cliente.");
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { email } = req.params;
    if (!email) return res.status(404).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const clienteExist: any = await User.findOneBy({
      email: email,
    });

    let idUsuario = clienteExist.idUser;
    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });

    if (clienteExist) {
      const result: any = await User.delete(idUsuario);
      if (result) {
        await insertBitacora({
          nameTableAction: "user",
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El administrador "${decodedToken.userName}" eliminó el cliente con Email: "${clienteExist.email}"`,
        });
        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
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
