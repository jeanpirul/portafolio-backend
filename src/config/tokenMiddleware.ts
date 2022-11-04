import { Request, Response, NextFunction } from "express";
import { error } from "./responseApi";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";
import { User } from "../entities_DB/user";
import { Rol } from "../entities_DB/rol";

//función creará la verificacion del token para que el usuario pueda ingresar con las credenciales existentes
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = <string>req.headers["authorization"];
    const bearerToken = authHeader.split(" ")[1];

    if (!bearerToken) {
      res.status(401).json({ error: "Token no provehído." });
    } else {
      const decoded: any = jwt.verify(bearerToken, SECRET_KEY);
      next();
    }
  } catch (err) {
    res.status(403).json({
      //Database connection error
      error: "Error de permisos, falta suministrar un token de acceso!",
    });
  }
};

// FUNCION PARA VERIFICACIÓN DE ROL: Administrador
export const esAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const roleExtist = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let arr = [roleExtist];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.nameRol === "Administrador") {
        next();
        return;
      }
    }
  } catch (err) {
    res
      .status(404)
      .send("Se necesitan permisos de acuerdo al Rol de Administrador!.")
      .json(await error(res.statusCode));
  }
};

// FUNCION PARA VERIFICACIÓN DE ROL: Cliente
export const esCliente = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const roleExtist = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let arr = [roleExtist];

    for (let i = 0; i < arr.length; i++) {
      if (
        arr[i]?.nameRol === "Administrador" ||
        arr[i]?.nameRol === "Cliente" ||
        arr[i]?.nameRol === "Bodega" ||
        arr[i]?.nameRol === "Cocina" ||
        arr[i]?.nameRol === "Finanza"
      ) {
        next();
        return;
      }
    }
  } catch (err) {
    res
      .status(404)
      .send("Se necesitan permisos de acuerdo al Rol de Cliente!.")
      .json(await error(res.statusCode));
  }
};

// FUNCION PARA VERIFICACIÓN DE ROL: Bodega
export const esBodega = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const roleExtist = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let arr = [roleExtist];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.nameRol === "Administrador" || arr[i]?.nameRol === "Bodega") {
        next();
        return;
      }
    }
  } catch (err) {
    res
      .status(404)
      .send("Se necesitan permisos de acuerdo al Rol de Bodega!.")
      .json(await error(res.statusCode));
  }
};

// FUNCION PARA VERIFICACIÓN DE ROL: Finanza
export const esFinanza = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const roleExtist = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let arr = [roleExtist];

    for (let i = 0; i < arr.length; i++) {
      if (
        arr[i]?.nameRol === "Administrador" ||
        arr[i]?.nameRol === "Finanza"
      ) {
        next();
        return;
      }
    }
  } catch (err) {
    res
      .status(404)
      .send("Se necesitan permisos de acuerdo al Rol de Finanza!.")
      .json(await error(res.statusCode));
  }
};

// FUNCION PARA VERIFICACIÓN DE ROL: Cocina
export const esCocina = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );
    const roleExtist = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let arr = [roleExtist];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.nameRol === "Administrador" || arr[i]?.nameRol === "Cocina") {
        next();
        return;
      }
    }
  } catch (err) {
    res
      .status(404)
      .send("Se necesitan permisos de acuerdo al Rol de Cocina!.")
      .json(await error(res.statusCode));
  }
};
