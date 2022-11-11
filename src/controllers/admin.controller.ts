import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { insertBitacora } from "./action.controller";
import { connectDB } from "../config/config";
import { User } from "../entities_DB/user";
import { Rol } from "../entities_DB/rol";
import * as jwt from "jsonwebtoken";

export const updateRole = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    console.log("Se ha solicitado una actualización del rol del User.");
    const { email, fk_Rol } = req.body;
    if (!email || !fk_Rol)
      return res
        .status(400)
        .json({ message: `Parámetro ${email} y/o rol  no ingresado` });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const userExist: any = await User.findOneBy({
      email: email,
    });
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (!userExist) {
      return res.status(404).json({
        error: "Usuario no existe para actualizar.",
      });
    } else if (userExist) {

      const result = await User.update(userExist, { fk_Rol: fk_Rol });
      const getRol = await Rol.findOneBy({ idRol: fk_Rol });

      if (result) {
        await insertBitacora({
          nameTableAction: "user",
          nameRole: getRol?.nameRol,
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
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};
