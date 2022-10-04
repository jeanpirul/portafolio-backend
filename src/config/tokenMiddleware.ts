import { Request, Response, NextFunction } from "express";
import { error } from "./responseApi";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";

//función creará la verificacion del token para que el usuario pueda ingresar con las credenciales existentes
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = <string>req.headers["authorization"];
    const bearerToken = authHeader.split(" ")[1];

    if (bearerToken == null) {
      res.status(401).json(await error(res.statusCode));
    } else {
      jwt.verify(bearerToken, SECRET_KEY, (err, user) => {
        if (err) {
          res.status(403).json(error(res.statusCode));
        } else {
          console.log("user ", user);
          return user;
        }
      });
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(403).json(await error(res.statusCode));
  }
};
