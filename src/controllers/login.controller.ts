import { Request, Response } from "express";
import { Client } from "../entities_DB/client";
import { SECRET_KEY } from "../environment";
import { error } from "../config/responseApi";
import * as jwt from "jsonwebtoken";
import("../config/config");

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Primero buscan cliente que exista con el email y contraseña que ingresamos
  const clientFound = await Client.query(
    "SELECT * FROM client WHERE email = $1;",
    [email]
  );

  if (clientFound != 0) {
    const matchPassword = await Client.comparePassword(
      password,
      clientFound[0].password
    );

    if (!matchPassword)
      return res
        .status(401)
        .json({ tokenClient: null, message: "Invalid password" });

    //Devolverá un objeto json con la respuesta el token que utilizaremos para las acciones necesarias segun el rol
    const tokenClient = jwt.sign({ id: clientFound.id }, SECRET_KEY, {
      expiresIn: 86400,
    });

    res
      .status(200)
      .json({ message: "Token Generado correctamente!", tokenClient });
  } else {
    //indicará un error de parametros.
    res.status(400).json(await error(res.statusCode));
  }
};
