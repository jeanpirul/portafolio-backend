import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import * as jwt from 'jsonwebtoken';
import { Product } from '../entities_DB/product';
import { Plato } from '../entities_DB/platos';
import { PlatoProduct } from '../entities_DB/platosProduct';
import { connectDB } from '../config/config';
import { Rol } from '../entities_DB/rol';
import { insertActionBodega } from './actionBodega.controller';
import { insertProducto } from './bodega.controller';
import { insertBitacora } from './action.controller';
import { Pedido } from '../entities_DB/pedido';
import { insertActionCliente } from './actionCliente.controller';
import { insertActionCocina } from './actionCocina.controller';
import { insertActionFinanza } from './actionFinanza.controller';
import { insertActionPedido } from './actionPedido.controller';

export const crearPedido = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { nombrePlato, cantidad, tipoPago, mesa, cantidadPersonas } =
      req.body;

    if (!nombrePlato || !cantidad || !tipoPago || !mesa || !cantidadPersonas)
      return res.status(404).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const platoEncontrado = await Plato.query(
      `select * from public.plato where "nombrePlato" = $1`,
      [nombrePlato]
    );

    if (platoEncontrado[0]) {
      let plato = platoEncontrado[0].nombrePlato;
      let precio = platoEncontrado[0].precioPlato;
      let fk_Plato = platoEncontrado[0].idPlato;
      let totalPaga = cantidad * precio * cantidadPersonas;
      const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });

      const newPedido = await Pedido.save({
        nombrePedido: plato,
        cantidad: cantidad,
        precio: precio,
        total: totalPaga,
        tipoPago: tipoPago,
        mesa: mesa,
        cantidadPersonas: cantidadPersonas,
        fk_User: decodedToken.idUser,
      });

      if (newPedido) {
        await insertBitacora({
          nameTableAction: 'pedido',
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó un pedido de "${plato}" pagando un total de $ ${totalPaga}.`,
        });

        await insertActionCliente({
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          nombrePedido: plato,
          estadoPedido: 'Listo',
          pedidoEntregado: true,
          detalleActionCliente: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó un pedido de "${plato}"`,
        });

        await insertActionCocina({
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          nombrePedido: plato,
          estadoPedido: 'Listo',
          listoEntrega: true,
          pedidoEntregado: true,
          detalleActionCocina: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó un pedido de "${plato}".`,
        });

        const productoEncontrado = await PlatoProduct.query(
          `select * from "platoProduct" pp where "fk_Plato" = $1`,
          [fk_Plato]
        );

        let totalGanancia = [];
        for (const ganancia of productoEncontrado) {
          let idProducto = ganancia.fk_Product;
          const valorProducto = await PlatoProduct.query(
            `select precio from product where "idProduct"  = $1`,
            [idProducto]
          );
          let addNewValue = valorProducto[0].precio;
          totalGanancia.push(addNewValue);
        }

        let totalEgresos = 0;
        for (const sumaValores of totalGanancia) totalEgresos += sumaValores;

        let totalEgresosFinanza = productoEncontrado.length * totalEgresos;
        let totalGananciaFinanza = totalPaga - totalEgresosFinanza;
        await insertActionFinanza({
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          totalIngresos: totalPaga,
          totalEgresos: totalEgresosFinanza,
          totalGanancia: totalGananciaFinanza,
          detalleActionFinanza: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó un pedido de "${plato}", pagando un total de: ${totalPaga}`,
        });

        await insertActionPedido({
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          nombrePedido: plato,
          cantidad: cantidad,
          precio: precio,
          total: totalPaga,
          tipoPago: tipoPago,
          mesa: mesa,
          cantidadPersonas: cantidadPersonas,
          detalleActionPedido: `El ${getRol?.nameRol} "${decodedToken.userName}" realizó un pedido de "${plato}", pagando un total de: ${totalPaga}`,
        });
      }
      res.status(201).json({
        message: 'El pedido se realizó exitosamente!',
      });
    } else {
      res.status(400).json({
        message: 'No se pudo realizar el registro de un nuevo Pedido!',
      });
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

export const nuevoPlato = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { nombrePlato, precioPlato, productos } = req.body;
    if (!nombrePlato || !precioPlato || !productos)
      return res.status(400).json(await error(res.statusCode));

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

      await insertBitacora({
        nameTableAction: 'product',
        nameRole: getRol?.nameRol,
        idUser: decodedToken.idUser,
        userName: decodedToken.userName,
        actionDetail: `El ${getRol?.nameRol} creó una solicitud de nuevos productos para el Bodeguero por un monto de: ${totalPagar}.`,
      });

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

export const getPlatos = async (req: Request, res: Response) => {
  try {
    const findAllPlatos = await Plato.find();

    //Si no existen datos los productos, recibiremos un error por consola, indicando que no existen.
    !findAllPlatos
      ? res.status(404).json({ message: 'Platos not found.' })
      : res.json({ listPlatoss: findAllPlatos });
  } catch (error) {
    throw error;
  }
};

export const getPlatoById = async (req: Request, res: Response) => {
  try {
    const { idPlato } = req.params;
    if (!idPlato) return res.status(400).json(await error(res.statusCode));

    const plato = await Plato.query(
      `select * from public.plato where "idPlato" = $1;`,
      [Number(idPlato)]
    );

    !plato
      ? res.status(404).json({ message: 'Plato not found' })
      : res.json({ listPlato: plato });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
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
