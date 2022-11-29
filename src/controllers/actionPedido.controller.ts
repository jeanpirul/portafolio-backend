import { Request, Response } from 'express';
import { InsertResult } from 'typeorm';
import { error, success } from '../config/responseApi';
import { ActionPedido } from '../entities_DB/actionPedido';
import { IActionPedido } from '../models/insertActionPedido';

export const createActionPedido = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log('Se ha solicitado una creación de la entidad actionPedido');

    const {
        nombreResponsable,
        nombreRol,
        nombrePedido,
        cantidad,
        precio,
        total,
        tipoPago,
        mesa,
        cantidadPersonas,
        detalleActionPedido,
    } = req.body;

    if (
        !nombreResponsable ||
        !nombreRol ||
        !nombrePedido ||
        !cantidad ||
        !precio ||
        !total ||
        !tipoPago ||
        !mesa ||
        !cantidadPersonas ||
        !detalleActionPedido
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await ActionPedido.save(req.body);

    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const readActionPedido = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result: any = await ActionPedido.find({
      order: { fecha: 'DESC' },
    });
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(401).json(await error(res.statusCode));
  }
};

export const insertActionPedido = async (
  action: IActionPedido
): Promise<InsertResult> => {
  try {
    const resultado = await ActionPedido.insert(action);
    return resultado;
  } catch (err) {
    throw err;
  }
};
