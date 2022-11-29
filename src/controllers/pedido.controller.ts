import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import * as jwt from 'jsonwebtoken';
import { Product } from '../entities_DB/product';
import { Plato } from '../entities_DB/platos';
import { PlatoProduct } from '../entities_DB/platosProduct';
import { connectDB } from '../config/config';
import { insertProducto } from './action.controller';
import { Rol } from '../entities_DB/rol';
import { insertActionBodega } from './actionBodega.controller';

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const { nombrePlato, cantidad, precio, total, tipoPago } = req.body;
    if (!nombrePlato || !cantidad || !precio || !total || !tipoPago)
      return res.status(404).json(await error(res.statusCode));

    const platoEncontrado = await Plato.query(
      `select * from public.plato where "nombrePlato" = $1`,
      [nombrePlato]
    );

    if (platoEncontrado[0]) {
      console.log('platoEncontrado ', platoEncontrado);
    } else {
      console.log('NO EXISTE EL PLATO KULIAO');
    }
  } catch (error) {
    throw error;
  }
};

export const nuevoPlato = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { nombrePlato, precioPlato, productos } = req.body;

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const newPlate = await Plato.save({
      nombrePlato: nombrePlato,
      precioPlato: precioPlato,
    });

    for (let prod of productos) {
      const newProduct = await insertProducto({
        nombreProducto: prod.nombreProducto,
        cantidad: prod.cantidad,
        precio: prod.precio,
        fk_User: decodedToken.idUser,
      });

      let plato = newPlate.idPlato;
      const insertPlatoProduct = await PlatoProduct.save({
        fk_Plato: plato,
        fk_Product: newProduct.raw[0].idProduct,
      });

      const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
      let totalPagar = prod.cantidad * prod.precio;
      await insertActionBodega({
        nombreResponsable: decodedToken.userName,
        nombreRol: getRol?.nameRol,
        nombreProducto: prod.nombreProducto,
        cantidad: prod.cantidad,
        precio: prod.precio,
        totalPago: totalPagar,
        detalleActionBodega: `El Usuario ${decodedToken.userName} con rol ${getRol?.nameRol} creó una solicitud de nuevos productos para el Bodeguero por un monto de: ${totalPagar}`,
      });
    }

    res.status(201).json({
      message: 'nuevo plato registrado exitosamente!',
    });
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

export const updateCantidad = async (req: Request, res: Response) => {
  const { idProduct, cantidad } = req.body;

  const productFound = await Product.query(
    `select * from public.product where "idProduct" = $1;`,
    [idProduct]
  );

  if (productFound[0]) {
    const result = await Product.update(productFound[0].idProduct, {
      cantidad: cantidad - 1,
    });

    console.log('result ', result);
  }
};
