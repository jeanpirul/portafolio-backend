import { Request, Response } from "express";
import { InsertResult } from "typeorm";
import { error, success } from "../config/responseApi";
import { ActionFinanza } from "../entities_DB/actionFinanza";
import { IActionFinanza } from "../models/insertActionFinanza";

export const createActionFinanza = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Se ha solicitado una creación de la entidad actionFinanza");

    const {
      nombreResponsable,
      nombreRol,
      totalIngresos,
      totalEgresos,
      totalGanancia,
      detalleActionFinanza,
    } = req.body;

    if (
      !nombreResponsable ||
      !nombreRol ||
      !totalIngresos ||
      !totalEgresos ||
      !totalGanancia ||
      !detalleActionFinanza
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await ActionFinanza.save(req.body);

    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readActionFinanza = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result: any = await ActionFinanza.find({
      order: { fecha: "DESC" },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(401).json(await error(res.statusCode));
  }
};

export const insertActionFinanza = async (
  action: IActionFinanza
): Promise<InsertResult> => {
  try {
    const resultado = await ActionFinanza.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
