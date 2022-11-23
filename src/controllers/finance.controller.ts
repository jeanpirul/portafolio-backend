import express, { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { Finance } from '../entities_DB/finance';
import { insertBitacora } from './action.controller';
import { connectDB } from '../config/config';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities_DB/user';
import { Rol } from '../entities_DB/rol';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { insertActionFinanza } from './actionFinanza.controller';

export const createFinance = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { totalIncome, totalExpenses, purchaseDetail } = req.body;

    if (!totalIncome || !totalExpenses || !purchaseDetail)
      return res.status(400).json(await error(res.statusCode));

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    let idRol = decodedToken.idUser;
    const result = await Finance.save({
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      purchaseDetail: purchaseDetail,
      fk_User: idRol,
    });

    const userFound = await User.findOneBy({
      idUser: decodedToken.idUser,
    });

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
    if (result) {
      await insertBitacora({
        nameTableAction: 'finance',
        nameRole: getRol?.nameRol,
        idUser: decodedToken.idUser,
        userName: decodedToken.userName,
        actionDetail: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} registro una nueva finanza.`,
      });

      let totalVentas = totalIncome - totalExpenses;

      await insertActionFinanza({
        nombreResponsable: decodedToken.userName,
        nombreRol: getRol?.nameRol,
        totalIngresos: totalIncome,
        totalEgresos: totalExpenses,
        totalGanancia: totalVentas,
        detalleActionFinanza: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} registro una nueva finanza.`,
      });

      res.status(201).json({
        message: 'Finanza registrada exitosamente!',
        result,
      });
    }
    // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    console.log('Error de creación', error);
    return res
      .status(500)
      .send({
        error: 'Error en la base de datos al registrar una nueva finanza!',
      })
      .json(await error(res.statusCode));
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
};

export const getFinance = async (req: Request, res: Response) => {
  try {
    const finance = await Finance.find();
    !finance
      ? res.status(404).json({ message: 'Detail Finance not found' })
      : res.json({ listFinance: finance });

    // const doc = new PDFDocument({ bufferPages: true });
    // const filename = `Factura-${Date.now()}.pdf`;
    // const stream = res.setHeader('Content-Type', 'application/pdf; charset=utf-8');

    // const stream = res.writeHead(200, {
    //   'Content-Type': 'application/pdf; charset=utf-8',
    //   'Content-Disposition': `attachment; filename=${filename}}`,
    // });
    // res.write(stream);

    // doc.on('data', (data) => {
    //   stream.write(data);
    // });

    // doc.on('end', () => {
    //   stream.end();
    // });
    // const fileURL = new URL(process.argv[1]);
    // const namePath = fileURL.pathname.split("\\").slice(1,4);
    // console.log('namePath ', namePath);

    // doc.pipe(fs.createWriteStream(filename));

    // doc.text('prueba pdf', 30, 30);
    // doc.end();
  } catch (err) {
    //check if error is instance of Error
    console.log(error);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const getFinanceById = async (req: Request, res: Response) => {
  try {
    const { idFinance } = req.params;
    if (!idFinance) return res.status(400).json(await error(res.statusCode));

    const finance: any = await Finance.findOneBy({
      idFinance: Number(idFinance),
    });
    const financeExist: any = await Finance.findOne({ where: {idFinance: number} });
    console.log('financeExist ', financeExist);

    !finance
      ? res.status(404).json({ message: 'Finance not found' })
      : res.json({ listFinance: finance });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateFinance = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { idFinance, totalIncome, totalExpenses, purchaseDetail } = req.body;
    if (!idFinance)
      return res.status(404).json({ message: 'Finanzas no encontradas' });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const financeExist: any = await Finance.findOne(idFinance);

    console.log(financeExist);
    console.log('financeExist.idFinance ', financeExist.idFinance);

    if (financeExist) {
      const result = await Finance.update(financeExist, {
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        purchaseDetail: purchaseDetail,
      });

      if (result) {
        const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
        await insertBitacora({
          nameTableAction: 'finance',
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.userName,
          actionDetail: `El Responsable ${decodedToken.userName}
           con Rol ${getRol?.nameRol} 
           actualizo la finanza con id ${financeExist.idFinance}.`,
        });

        let totalVentas = totalIncome - totalExpenses;

        await insertActionFinanza({
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          totalIngresos: totalIncome,
          totalEgresos: totalExpenses,
          totalGanancia: totalVentas,
          detalleActionFinanza: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} actualizo la entrada con id ${financeExist.id}.`,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
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

export const deleteFinance = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.startTransaction();
    await queryRunner.connect();

    console.log('Se ha solicitado la eliminación de una entrada de finanzas.');
    const { idFinance } = req.params;
    if (!idFinance) return res.status(404).json(await error(res.statusCode));

    const financeExist: any = await Finance.findOneBy({
      idFinance: Number(idFinance),
    });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });

    let idFinanza = financeExist.idFinance;

    if (financeExist) {
      const result: any = await Finance.delete(idFinanza);
      if (result) {
        await insertBitacora({
          nameTableAction: 'finance',
          nameRole: getRol?.nameRol,
          idUser: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} elimino la entrada con id ${financeExist.id}.`,
        });

        // await insertActionFinanza({
        //   nombreResponsable: decodedToken.userName,
        //   nombreRol: getRol?.nameRol,
        //   totalIngresos: financeExist.totalIncome,
        //   totalEgresos: financeExist.totalExpenses,
        //   totalGanancia: financeExist.totalGanancia,
        //   detalleActionFinanza: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} elimino la entrada con id ${financeExist.id}.`,
        // });

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
