import { Request, Response } from "express";
import { getRepository, InsertResult } from "typeorm";
import { error, success } from "../config/responseApi";
import { Action } from "../entities_DB/action";
import { InsertBitacoraInterface } from "../models/insertBitacora";

export const createAction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una creación de la entidad Acciones");

    const {
      nameTableAction,
      nameRole,
      idUser,
      clientFirstName,
      actionDetail,
    } = req.body;

    if (
      !nameTableAction ||
      !nameRole ||
      !idUser ||
      !clientFirstName ||
      !actionDetail
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await Action.save(req.body);
    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readAction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una lista de la entidad Acciones");

    const result: any = await Action.find({
      order: { actionCreation: "DESC" },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const insertBitacora = async (
  action: InsertBitacoraInterface
): Promise<InsertResult> => {
  try {
    const resultado = await Action.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
