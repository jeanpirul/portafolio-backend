import { Request, Response } from "express";
import { Client } from "../entities_DB/client";
import("../config/config");
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";
import { error } from "../config/responseApi";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Primero buscan cliente que exista con el email y contraseña que ingresamos
  const result = await Client.query(
    "SELECT * FROM client WHERE email = $1 AND password = $2;",
    [email, password]
  );

  if (result != 0) {
    //si existe nuestra busqueda, generará un token
    const token = jwt.sign(
      { email: result.emai, password: result.password },
      SECRET_KEY,
      { expiresIn: 86400 }
    );
    //devolvera un objeto json y añadira a la respuesta el token que utilizaremos para las acciones necesarias segun el rol
    let resultCli = { ...result, token };
    res.status(200).json(resultCli);
  } else {
    //indicará un error de parametros.
    res.status(400).json(await error(res.statusCode));
  }
};
