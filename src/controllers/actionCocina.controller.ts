import { Request, Response } from "express";
import { InsertResult } from "typeorm";
import { error, success } from "../config/responseApi";
import { ActionCocina } from "../entities_DB/actionCocina";
import { IActionCocina } from "../models/insertActionCocina";

export const createActionCocina = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una creación de la entidad actionCocina");

    const {
      nombreResponsable,
      nombreRol,
      nombrePedido,
      estadoPedido,
      listoEntrega,
      pedidoEntregado,
      detalleActionCocina
    } = req.body;

    if (
      !nombreResponsable ||
      !nombreRol ||
      !nombrePedido ||
      !estadoPedido ||
      !listoEntrega ||
      !pedidoEntregado ||
      !detalleActionCocina
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await ActionCocina.save(req.body);

    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readActionCocina = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result: any = await ActionCocina.find({
      order: { fecha: "DESC" },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(401).json(await error(res.statusCode));
  }
};

export const insertActionCocina = async (
  action: IActionCocina
): Promise<InsertResult> => {
  try {
    const resultado = await ActionCocina.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
