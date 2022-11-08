import { Request, Response } from "express";
import { insertBitacora } from "./action.controller";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";
import { Rol } from "../entities_DB/rol";
import * as jwt from "jsonwebtoken";
import { User } from "../entities_DB/user";

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

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findOneBy({
      id: id,
    });

    !client
      ? res.status(404).json({ message: "No client found" })
      : res.json({ listClient: client });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    console.log("Se ha solicitado la eliminación de una entidad Cliente.");
    const { id } = req.params;
    if (!id) return res.status(404).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const clienteExist: any = await User.findOneBy({
      idUser: id,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    if (clienteExist) {
      const result: any = await User.delete(id);
      if (result) {
        await insertBitacora({
          nameTableAction: "client",
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
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};
