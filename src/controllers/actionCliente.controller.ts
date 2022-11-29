import { Request, Response } from "express";
import { InsertResult } from "typeorm";
import { error, success } from "../config/responseApi";
import { ActionCliente } from "../entities_DB/actionCliente";

export const createActionCliente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una creación de la entidad actionCliente");

    const {
      nombreResponsable,
      nombreRol,
      nombrePedido,
      estadoPedido,
      pedidoEntregado,
      detalleActionCliente,
    } = req.body;

    if (
      !nombreResponsable ||
      !nombreRol ||
      !nombrePedido ||
      !estadoPedido ||
      !pedidoEntregado ||
      !detalleActionCliente
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await ActionCliente.save(req.body);

    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readActionCliente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result: any = await ActionCliente.find({
      order: { fecha: "DESC" },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(401).json(await error(res.statusCode));
  }
};

export const insertActionCliente = async (
  action: ActionCliente
): Promise<InsertResult> => {
  try {
    const resultado = await ActionCliente.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
