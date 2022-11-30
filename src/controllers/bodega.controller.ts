import { Request, Response } from 'express';
import { insertBitacora } from './action.controller';
import { error, success } from '../config/responseApi';
import { insertActionBodega } from './actionBodega.controller';
import { connectDB } from '../config/config';
import { Product } from '../entities_DB/product';
import { Rol } from '../entities_DB/rol';
import * as jwt from 'jsonwebtoken';
import { InsertProducto } from '../models/producto.interface';
import { InsertResult } from 'typeorm';

export const insertProducto = async (
  producto: InsertProducto
): Promise<InsertResult> => {
  try {
    const resultado = await Product.insert(producto);
    return resultado;
  } catch (err) {
    throw err;
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { nombreProducto, cantidad, precio } = req.body;

    if (!nombreProducto || !cantidad || !precio)
      return res.status(404).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    let idRol = decodedToken.idUser;
    //Datos a guardar en Base de datos
    const result = await Product.save({
      nombreProducto: nombreProducto,
      cantidad: cantidad,
      precio: precio,
      fk_User: idRol,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    //Guardado de la acción en la bitácora.
    if (result) {
      await insertBitacora({
        nameTableAction: 'product',
        nameRole: getRol?.nameRol,
        fk_User: decodedToken.idUser,
        userName: decodedToken.email,
        actionDetail: `El usuario "${decodedToken.userName}" con rol ${getRol?.nameRol} realizó la creación del producto "${result.nombreProducto}".`,
      });

      let totalPago = result.cantidad * result.precio;

      await insertActionBodega({
        fk_User: decodedToken.idUser,
        nombreResponsable: decodedToken.userName,
        nombreRol: getRol?.nameRol,
        nombreProducto: result.nombreProducto,
        cantidad: result.cantidad,
        precio: result.precio,
        totalPago: totalPago,
        detalleActionBodega: `El usuario "${decodedToken.userName}" con rol ${getRol?.nameRol} realizó la creación del producto "${result.nombreProducto}".`,
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
      ? res.status(404).json({ message: 'Products not found.' })
      : res.json({ listProducts: findAllProducts });
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { idProduct } = req.params;
    if (!idProduct) return res.status(400).json(await error(res.statusCode));

    const product = await Product.query(
      `select * from public.product where "idProduct" = $1;`,
      [Number(idProduct)]
    );

    !product
      ? res.status(404).json({ message: 'Product not found' })
      : res.json({ listProduct: product });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const { idProduct, cantidad, precio } = req.body;

    if (!idProduct)
      return res.status(400).json({ message: 'Producto no encontrado' });

    const productFound: any = await Product.findOneBy({
      idProduct: idProduct,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    if (productFound) {
      const result = await Product.update(productFound, {
        idProduct: idProduct,
        cantidad: cantidad,
        precio: precio,
      });

      if (result) {
        await insertBitacora({
          nameTableAction: 'product',
          nameRole: getRol?.nameRol,
          fk_User: decodedToken.idUser,
          userName: decodedToken.userName,
          actionDetail: `El responsable de la caja: "${decodedToken.userName}" actualizo parámetros del producto con ${productFound.nombreProducto} a cargo.`,
        });

        let totalPago = productFound.cantidad * productFound.precio;

        await insertActionBodega({
          fk_User: decodedToken.idUser,
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          nombreProducto: productFound.nombreProducto,
          cantidad: productFound.cantidad,
          precio: productFound.precio,
          totalPago: totalPago,
          detalleActionBodega: `El responsable de la caja: "${decodedToken.userName}" actualizo parámetros del producto con ${productFound.nombreProducto} a cargo.`,
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

    console.log('Se ha solicitado la eliminación de un producto.');
    const { nombreProducto } = req.params;
    if (!nombreProducto)
      return res.status(404).json(await error(res.statusCode));

    const productExist: any = await Product.findOneBy({
      nombreProducto: nombreProducto,
    });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });

    let idProduct = productExist.idProduct;

    if (productExist) {
      const result: any = await Product.delete(idProduct);
      if (result) {
        await insertBitacora({
          nameTableAction: 'producto',
          nameRole: getRol?.nameRol,
          fk_User: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El ${getRol?.nameRol} "${decodedToken.email}" eliminó el producto "${productExist.nombreProducto}" `,
        });

        await insertActionBodega({
          fk_User: decodedToken.idUser,
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          nombreProducto: productExist.nombreProducto,
          cantidad: productExist.cantidad,
          precio: productExist.precio,
          totalPago: 0,
          detalleActionBodega: `El ${getRol?.nameRol} "${decodedToken.email}" eliminó el producto "${productExist.nombreProducto}"`,
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
