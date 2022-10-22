import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { User } from "../entities_DB/user";
import { insertBitacora } from "./action.controller";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";

export const createUser = async (req: Request, res: Response) => {
  const { userName, email, phoneNumber, password, nameRole } = req.body;
  try {
    const userFound = await User.findOneBy({
      email: email,
    });
    if (userFound) {
      return res.status(400).json({
        error: "Email ya existe, no necesita registrarlo de nuevo.",
      });
    } else {
      //Inserting data into the database
      const result = await User.save({
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: await User.encryptPassword(password),
        nameRole: nameRole,
      });

      const tokenUser = jwt.sign({ id: result.idUser }, SECRET_KEY, {
        expiresIn: 86400,
      });
      console.log("token user ", tokenUser);

      await insertBitacora({
        nameTableAction: "user",
        idTableAction: result.idUser,
        idUser: result.idUser,
        userName: result.email,
        actionDetail: `Creación de nuevo user con email: "${result.email}"`,
      });

      res.status(201).json({
        message: "Usuario registrado exitosamente!",
        result,
      });
    }
  } catch (error) {
    //check if error is a instance of Error
    console.log("Error de creación", error);
    //send a json response with the error message
    res.status(500).json({
      //Database connection error
      error: "Error en la base de datos al registrar un nuevo user!",
    });
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
  try {
    const user = await User.findOneBy({
      idUser: idUser,
    });

    !user
      ? res.status(404).json({ message: "No user found" })
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log("Se ha solicitado una actualización de la entidad Usere.");
    const { password, email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Parámetro Email no ingresado" });

    const userExist: any = await User.findOneBy({
      email: email,
    });

    if (userExist) {
      const result = await User.update(userExist, {
        password: password,
      });

      if (result) {
        await insertBitacora({
          nameTableAction: "user",
          idTableAction: userExist.id,
          idUser: userExist.id,
          userName: userExist.email,
          actionDetail: `Se actualizó la contraseña del Email: "${userExist.email}"`,
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
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    console.log("Se ha solicitado la eliminación de una entidad Usere.");
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
          idTableAction: userExist.id,
          idUser: userExist.id,
          userName: userExist.email,
          actionDetail: `Se Eliminó el user con Email: "${userExist.email}"`,
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
  }
};
