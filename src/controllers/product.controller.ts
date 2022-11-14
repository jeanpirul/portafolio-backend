import { Request, Response } from "express";
import { Product } from "../entities_DB/product";
import { insertBitacora } from "./action.controller";
import * as jwt from "jsonwebtoken";
import { error, success } from "../config/responseApi";
import { Rol } from "../entities_DB/rol";
import { connectDB } from "../config/config";

export const createProduct = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { nombreProducto, cantidad, precio, disponibilidad } = req.body;

    if (!nombreProducto || !cantidad || !precio || !disponibilidad)
      return res.status(400).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    //Datos a guardar en Base de datos
    const result = await Product.save({
      nombreProducto: nombreProducto,
      cantidad: cantidad,
      precio: precio,
      disponibilidad: disponibilidad,
      fk_User: decodedToken.idUser,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    //Guardado de la acción en la bitácora.
    if (result) {
      await insertBitacora({
        nameTableAction: "product",
        nameRole: getRol?.nameRol,
        idUser: decodedToken.idUser,
        userName: decodedToken.email,
        actionDetail: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó la creación del producto "${result.nombreProducto}".`,
      });

      //Retorno de respuesta exitosa o caso error.
      return result
        ? res.status(201).json(await success({ data: result }, res.statusCode))
        : res.status(422).json(await error(res.statusCode));
    }
    // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};

//Consulta para obtener todos los productos existentes en la base de datos.
export const getProduct = async (req: Request, res: Response) => {
  try {
    const findAllProducts = await Product.find();

    //Si no existen datos los productos, recibiremos un error por consola, indicando que no existen.
    !findAllProducts
      ? res.status(404).json({ message: "Products not found." })
      : res.json({ listProducts: findAllProducts });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const { idProduct, nombreProducto, cantidad, precio, disponibilidad } =
      req.body;

    if (!idProduct)
      return res.status(400).json({ message: "Producto no encontrado" });

    const productFound: any = await Product.findOneBy({
      idProduct: idProduct,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    if (productFound) {
      const result = await Product.update(productFound, {
        idProduct: idProduct,
        cantidad: cantidad,
        precio: precio,
        disponibilidad: disponibilidad,
      });

      if (result) {
        await insertBitacora({
          nameTableAction: "product",
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.userName,
          actionDetail: `El responsable de la caja: "${decodedToken.userName}" actualizaró parámetros del producto con ${productFound.nombreProducto} a cargo.`,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    } // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.startTransaction();
    await queryRunner.connect();

    console.log("Se ha solicitado la eliminación de un producto.");
    const { nombreProducto } = req.body;
    if (!nombreProducto)
      return res.status(404).json(await error(res.statusCode));

    const productExist: any = await Product.findOneBy({
      nombreProducto: nombreProducto,
    });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    let idProduct = productExist.idProduct;

    if (productExist) {
      const result: any = await Product.delete(idProduct);
      if (result) {
        await insertBitacora({
          nameTableAction: "producto",
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El ${getRol?.nameRol} "${decodedToken.email}" eliminó el producto "${productExist.nombreProducto}" `,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    } // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};
