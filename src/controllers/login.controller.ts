import { Request, Response } from "express";
import { SECRET_KEY } from "../environment";
import { error } from "../config/responseApi";
import { User } from "../entities_DB/user";
import * as jwt from "jsonwebtoken";
import("../config/config");
import { serialize } from "cookie";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json(await error(res.statusCode));

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
        return res.status(401).json({ message: "Contraseña inválida." });

      //Devolverá un objeto json con la respuesta el token que utilizaremos para las acciones necesarias segun el rol
      const tokenUser = jwt.sign(
        {
          idRol: userFound.fk_Rol,
          idUser: userFound.idUser,
          email: userFound.email,
          userName: userFound.userName,
        },
        SECRET_KEY,
        {
          expiresIn: 86400,
        }
      );
      const serialized = serialize("tokenUser", tokenUser, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialized);

      res
        .status(200)
        .json({ message: "Token Generado correctamente!", tokenUser });
    } else {
      //indicará un error de parametros.
      res.status(400).json({
        message: "Usuario no existe, por favor registrarse en la Aplicación.",
      });
    }
  } catch (err) {
    res
      .status(404)
      .send("Usuario no existe, por favor registrarse en la Aplicación.")
      .json(await error(res.statusCode));
  }
};
