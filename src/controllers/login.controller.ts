import { Request, Response } from "express";
import { Client } from "../entities_DB/client";
import { SECRET_KEY } from "../environment";
import { error } from "../config/responseApi";
import * as jwt from "jsonwebtoken";
import { User } from "../entities_DB/user";
import("../config/config");

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Primero buscan cliente que exista con el email que ingresamos
  const userFound = await User.findOneBy({
    email: email,
  });
  //realiza comparacion entre la contraseña ingresada y la contraseña guardada en base de datos.
  if (userFound) {
    const matchPassword = await User.comparePassword(
      password,
      userFound.password
    );

    if (!matchPassword)
      return res
        .status(401)
        .json({ tokenUser: null, message: "Invalid password" });

    //Devolverá un objeto json con la respuesta el token que utilizaremos para las acciones necesarias segun el rol
    const tokenUser = jwt.sign(
      { id: userFound.idUser, userName: userFound.userName },
      SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );

    res
      .status(200)
      .json({ message: "Token Generado correctamente!", tokenUser });
  } else {
    //indicará un error de parametros.
    res.status(400).json(await error(res.statusCode));
  }
};
