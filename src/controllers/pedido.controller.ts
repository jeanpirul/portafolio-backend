import { Request, Response } from 'express';
import { insertBitacora } from './action.controller';
import * as jwt from 'jsonwebtoken';
import { error, success } from '../config/responseApi';

import { connectDB } from '../config/config';
import { insertActionBodega } from './actionBodega.controller';
import { Product } from '../entities_DB/product';
import { Plato } from '../entities_DB/platos';
import { PlatoProduct } from '../entities_DB/platosProduct';

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const { nombrePlato, cantidad, precio, total, tipoPago } = req.body;
    if (!nombrePlato || !cantidad || !precio || !total || !tipoPago)
      return res.status(404).json(await error(res.statusCode));

    // cazuela = papas, pollo, choclo;

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
  try {
    const { nombrePlato, precioPlato, productos } = req.body;

    const newPlate = await Plato.save({
      nombrePlato: nombrePlato,
      precioPlato: precioPlato,
    });
    const newProduct = await Product.save(productos);

    for (const product of newProduct) {
      let plato = newPlate.idPlato;
      const insertPlatoProduct = await PlatoProduct.save({
        fk_Plato: plato,
        fk_Product: product,
      });
    }

    res.status(201).json({
      message: 'nuevo plato registrado exitosamente!',
    });
  } catch (error) {
    throw error;
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

export const crearPedido2 = async (req: Request, res: Response) => {
  // const queryRunner = connectDB.createQueryRunner();
  try {
    console.log('Se ha solicitado la creación de un nuevo pedido.');
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // const { nombreProducto } = req.body;
    let nombreProducto = 'Palta';
    let productos = [];

    const getProducts: any = await Product.findOneBy({
      nombreProducto: nombreProducto,
    });
    console.log('getProducts ', getProducts);

    let quitarCantidadProducto = getProducts?.cantidad - 1;

    console.log('quitarCantidadProducto ', quitarCantidadProducto);

    // const get = await Product.find();
    // console.log('getProducts ', getProducts);

    !getProducts
      ? res.status(404).json({ message: 'No users found' })
      : res.json({ listProduct: getProducts });
  } catch (err) {
    // since we have errors let's rollback changes we made
    // await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    return res.status(500).json(await error(res.statusCode));
  }
  //   finally {
  //     // you need to release query runner which is manually created:
  //     await queryRunner.release();
  //   }
};

// "listaPedidos":
// [
//   {
//     "idPedido" : 1,
//     "nombrePedido" : "pollo asado con papas",
//     "productos" : [
//         {
//             "idProducto": 1,
//             "nombreProducto": "pollo"
//         },
//         {
//           "idProducto": 4,
//           "nombreProducto": "papas"
//         }
//     ]
//   }
// ]
