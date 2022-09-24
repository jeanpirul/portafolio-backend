import { Request, Response } from "express";
import { InsertResult } from "typeorm";
import { error, success } from "../config/responseApi";
import { Action } from "../entities_DB/action";

export const createAction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una creación de la entidad Acciones");

    const {
      nameTableAction,
      idTableAction,
      idClient,
      clientFirstName,
      actionDetail,
    } = req.body;

    if (
      !nameTableAction ||
      !idTableAction ||
      !idClient ||
      !clientFirstName ||
      !actionDetail
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await Action.save(req.body);
    console.log("result ", result);
    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};
