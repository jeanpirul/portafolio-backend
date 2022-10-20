import { Request, Response } from "express";
import { Product } from "../entities_DB/product";
import { insertBitacora } from "./action.controller";
import * as jwt from "jsonwebtoken";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { amount, nameProduct, availability, price, username } = req.body;
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    //Datos a guardar en Base de datos
    const result = await Product.save({
      nameProduct: nameProduct,
      amount: amount,
      availability: availability,
      price: price,
      username: username,
    });

    //Guardado de la acción en la bitácora.
    if (result)
      await insertBitacora({
        nameTableAction: "product",
        idTableAction: result.idProduct.toExponential(),
        idClient: result.idProduct.toString(),
        userName: result.username,
        actionDetail: `Creación de nuevo producto : "${result.nameProduct}"`,
      });

    //Retorno de respuesta exitosa o caso error.
    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  }
};

//Consulta para obtener todos los productos existentes en la base de datos.
export const getProduct = async (req: Request, res: Response) => {
  try {
    const findAllProducts = await Product.find();

    //Si no existen datos los productos, recibiremos un error por consola, indicando que no existen.
    !findAllProducts
      ? res.status(404).json({ message: "Products not found." })
      : res.json({ listClient: findAllProducts });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { idProduct, nameProduct, amount, availability, price, userName } =
      req.body;

    if (!idProduct)
      return res.status(400).json({ message: "Finance not found" });

    const financeExist: any = await Product.findOneBy({
      idProduct: idProduct,
    });

    if (financeExist) {
      const result = await Product.update(financeExist, {
        idProduct: idProduct,
        amount: amount,
        availability: availability,
        price: price,
      });
      if (result) {
        await insertBitacora({
          nameTableAction: "product",
          idTableAction: financeExist.id,
          idClient: financeExist.id,
          userName: financeExist.userName,
          actionDetail: `Se actualizaron parámetros de la finanza con id ${financeExist.id} a cargo del responsable de la caja: "${financeExist.userName}".`,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  try {
    console.log("eliminar");
  } catch (error) {
    throw error;
  }
};