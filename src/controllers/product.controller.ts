import { Request, Response } from "express";
import { Product } from "../entities_DB/product";
import { insertBitacora } from "./action.controller";
import * as jwt from "jsonwebtoken";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { amount, nameProduct, availability, price, username, email } =
      req.body;
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    console.log("decodedToken ", decodedToken);

    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]);

    const result = await Product.save({
      nameProduct: nameProduct,
      amount: amount,
      availability: availability,
      price: price,
      username: username,
    });

    if (result)
      await insertBitacora({
        nameTableAction: "product",
        idTableAction: result.idProduct,
        idClient: result.idProduct,
        userName: result.username,
        actionDetail: `Creación de nuevo producto : "${result.nameProduct}"`,
      });
    // if (result)
    //   await insertBitacora({
    //     nameTableAction: "product",
    //     idTableAction: result.idProduct,
    //     idClient: decodedToken.oid,
    //     userName: decodedToken.name,
    //     actionDetail: `Creación de nuevo producto : "${result.nameProduct}"`,
    //   });
    return result
      ? res.status(201).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    return res.status(500).json(await error(res.statusCode));
  }
};

export const getProduct = (req: Request, res: Response) => {
  try {
    console.log("listar");
  } catch (error) {
    throw error;
  }
};

export const getProductById = (req: Request, res: Response) => {
  try {
    console.log("listar por id");
  } catch (error) {
    throw error;
  }
};

export const updateProduct = (req: Request, res: Response) => {
  try {
    console.log("actualizar");
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
