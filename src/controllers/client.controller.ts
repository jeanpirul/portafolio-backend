import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";
import { insertBitacora } from "./action.controller";

export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.find();
    !client
      ? res.status(404).json({ message: "No users found" })
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

    const clienteExist: any = await Client.findOneBy({
      id: id,
    });

    if (clienteExist) {
      const result: any = await Client.delete(id);
      if (result) {
        await insertBitacora({
          nameTableAction: "client",
          nameRole: clienteExist.id,
          idUser: clienteExist.id,
          userName: clienteExist.email,
          actionDetail: `Se Eliminó el cliente con Email: "${clienteExist.email}"`,
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
