import express, { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { Finance } from '../entities_DB/finance';
import { insertBitacora } from './action.controller';
import { connectDB } from '../config/config';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities_DB/user';
import { Rol } from '../entities_DB/rol';
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
        fk_User: decodedToken.idUser,
        userName: decodedToken.userName,
        actionDetail: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} registro una nueva finanza.`,
      });

      let totalVentas = totalIncome - totalExpenses;

      await insertActionFinanza({
        fk_User: decodedToken.idUser,
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

    const finance = await Finance.query(
      `select * from public.finance where "idFinance" = $1;`,
      [idFinance]
    );

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

    const financeExist = await Finance.query(
      `select * from public.finance where "idFinance" = $1;`,
      [idFinance]
    );

    if (financeExist[0]) {
      const result = await Finance.update(financeExist[0].idFinance, {
        idFinance: idFinance,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        purchaseDetail: purchaseDetail,
      });

      if (result) {
        const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });
        await insertBitacora({
          nameTableAction: 'finance',
          nameRole: getRol?.nameRol,
          fk_User: decodedToken.idUser,
          userName: decodedToken.userName,
          actionDetail: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} actualizo la finanza con id ${financeExist[0].idFinance}.`,
        });

        let totalVentas = totalIncome - totalExpenses;

        await insertActionFinanza({
          fk_User: decodedToken.idUser,
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          totalIngresos: totalIncome,
          totalEgresos: totalExpenses,
          totalGanancia: totalVentas,
          detalleActionFinanza: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} actualizo la entrada con id ${financeExist[0].idFinance}.`,
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

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace('Bearer ', '')
        : ''
    );

    const financeExist = await Finance.query(
      `select * from public.finance where "idFinance" = $1;`,
      [idFinance]
    );

    const getRol = await Rol.findOneBy({ idRol: decodedToken.idRol });

    if (financeExist[0]) {
      const result = await Finance.delete(financeExist[0].idFinance);
      if (result) {
        await insertBitacora({
          nameTableAction: 'finance',
          nameRole: getRol?.nameRol,
          fk_User: decodedToken.idUser,
          userName: decodedToken.email,
          actionDetail: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} elimino la entrada con id ${financeExist[0].idFinance}.`,
        });

        let total = financeExist[0].totalIncome - financeExist[0].totalExpenses;

        await insertActionFinanza({
          fk_User: decodedToken.idUser,
          nombreResponsable: decodedToken.userName,
          nombreRol: getRol?.nameRol,
          totalIngresos: financeExist[0].totalIncome,
          totalEgresos: financeExist[0].totalExpenses,
          totalGanancia: total,
          detalleActionFinanza: `El Responsable ${decodedToken.userName} con Rol ${getRol?.nameRol} elimino la entrada con id ${financeExist[0].idFinance}.`,
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