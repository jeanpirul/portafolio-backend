import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { InsertResult } from 'typeorm';
import { ActionBodega } from '../entities_DB/actionBodega';
import { IActionBodega } from '../models/insertActionBodega';

export const createActionBodega = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log('Se ha solicitado una creación de la entidad actionBodega');

    const {
      nombreResponsable,
      nombreRol,
      nombreProducto,
      cantidad,
      precio,
      totalPago,
      detalleActionBodega,
    } = req.body;

    if (
      !nombreResponsable ||
      !nombreRol ||
      !nombreProducto ||
      !cantidad ||
      !precio ||
      !totalPago ||
      !detalleActionBodega
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await ActionBodega.save(req.body);

    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readActionBodega = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result: any = await ActionBodega.find({
      order: { fechaCreacion: 'DESC' },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(401).json(await error(res.statusCode));
  }
};

export const insertActionBodega = async (
  action: IActionBodega
): Promise<InsertResult> => {
  try {
    const resultado = await ActionBodega.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
