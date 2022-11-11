import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { User } from "../entities_DB/user";
import { insertBitacora } from "./action.controller";
import { SECRET_KEY } from "../environment";
import { Rol } from "../entities_DB/rol";
import { connectDB } from "../config/config";
import * as jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { userName, email, phoneNumber, password } = req.body;

    if (!userName || !email || !phoneNumber || !password)
      return res.status(404).json(await error(res.statusCode));

    const userFound = await User.findOneBy({
      email: email,
    });

    if (userFound) {
      return res.status(400).json({
        error: "Email ya existe, no necesita registrarlo de nuevo.",
      });
    } else {
      // Asignamos el rol por defecto de Cliente para un nuevo Usuario.
      let rolDefault = 2;
      let rol = rolDefault;

      //Inserting data into the database
      const result = await User.save({
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: await User.encryptPassword(password),
        fk_Rol: rol,
      });

      const tokenUser = jwt.sign({ id: result.idUser }, SECRET_KEY, {
        expiresIn: 86400,
      });
      console.log("token user ", tokenUser);

      const getRol = await Rol.findOneBy({ idRol: rol });

      await insertBitacora({
        nameTableAction: "user",
        nameRole: getRol?.nameRol,
        idUser: result.idUser,
        userName: result.email,
        actionDetail: `Creación de nuevo user con email: "${result.email}"`,
      });

      res.status(201).json({
        message: "Usuario registrado exitosamente!",
        result,
      });
    }
    // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (error) {
    //check if error is a instance of Error
    console.log("Error de creación", error);
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //send a json response with the error message
    res.status(500).json({
      //Database connection error
      error: "Error en la base de datos al registrar un nuevo user!",
    });
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    !user
      ? res.status(404).json({ message: "No users found" })
      : res.json({ listUser: user });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error

    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { idUser } = req.params;

  if (!idUser) return res.status(400).json(await error(res.statusCode));

  try {
    const userFound = await User.findOneBy({
      idUser: idUser,
    });

    !userFound
      ? res.status(404).json({ message: "No user found" })
      : res.json({ listUser: userFound });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    console.log("Se ha solicitado una actualización de la entidad User.");
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const { password, email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Parámetro Email no ingresado" });

    const userExist: any = await User.findOneBy({
      email: email,
    });

    if (userExist) {
      const result = await User.update(userExist, {
        password: await User.encryptPassword(password),
      });
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let setRol = 2 || req.body.rol;
      let rol = setRol;
      const getRol = await Rol.findOneBy({ idRol: rol });
      if (result) {
        await insertBitacora({
          nameTableAction: "user",
          nameRole: getRol?.nameRol,
          idUser: userExist.idUser,
          userName: userExist.email,
          actionDetail: `El Usuario "${
            decodedToken.email || userExist.email
          }" cambió la contraseña del usuario "${
            userExist.email
          }" exitosamente`,
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

export const deleteUser = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.startTransaction();
    await queryRunner.connect();
    console.log("Se ha solicitado la eliminación de una entidad User.");
    const { idUser } = req.params;
    if (!idUser) return res.status(404).json(await error(res.statusCode));

    const userExist: any = await User.findOneBy({
      idUser: idUser,
    });

    if (userExist) {
      const result: any = await User.delete(idUser);
      if (result) {
        await insertBitacora({
          nameTableAction: "user",
          nameRole: userExist.nameRole,
          idUser: userExist.id,
          userName: userExist.email,
          actionDetail: `Se Eliminó el user con Email "${userExist.email}" `,
        });
        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    } // commit transaction now:
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
