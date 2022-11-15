import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Finance } from "../entities_DB/finance";
import { insertBitacora } from "./action.controller";
import { connectDB } from "../config/config";
import * as jwt from "jsonwebtoken";

export const createFinance = async (req: Request, res: Response) => {
  const queryRunner = connectDB.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const {
      userName,
      totalIncome,
      totalExpenses,
      purchaseDate,
      purchaseDetail,
    } = req.body;

    if (
      !userName ||
      !totalIncome ||
      !totalExpenses ||
      !purchaseDate ||
      !purchaseDetail
    )
      return res.status(400).json(await error(res.statusCode));

    const result = await Finance.save({
      userName: userName,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      purchaseDate: purchaseDate,
      purchaseDetail: purchaseDetail,
    });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    if (result) {
      await insertBitacora({
        nameTableAction: "finance",
        nameRole: decodedToken.idRol,
        idUser: decodedToken.idUser,
        userName: decodedToken.userName,
        actionDetail: `El Cajero de nueva cuenta del usuario: "${result.userName}" responsable de la caja.`,
      }); //

      res.status(201).json({
        message: "Finanza registrada exitosamente!",
        result,
      });
    }
    // commit transaction now:
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
    //Si ocurre algún error, nos entregará un error detallado en la consola.
    console.log("Error de creación", error);
    return res
      .status(500)
      .send({
        error: "Error en la base de datos al registrar una nueva finanza!",
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
      ? res.status(404).json({ message: "Detail Finance not found" })
      : res.json({ listFinance: finance });
  } catch (error) {
    //check if error is instance of Error
    console.log(error);

    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getFinanceById = async (req: Request, res: Response) => {
  const { idFinance } = req.params;
  if (!idFinance) return res.status(400).json(await error(res.statusCode));

  try {
    const finance = await Finance.findOneBy({
      idFinance: idFinance,
    });
    !finance
      ? res.status(404).json({ message: "Finance not found" })
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

    const { idFinance, userName, totalIncome, totalExpenses, purchaseDetail } =
      req.body;
    if (!idFinance) return res.status(400).json({ message: "Finance not found" });

    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const financeExist: any = await Finance.findOneBy({
      idFinance: idFinance,
    });

    if (financeExist) {
      const result = await Finance.update(financeExist, {
        idFinance: idFinance,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        purchaseDetail: purchaseDetail,
      });
      if (result) {
        await insertBitacora({
          nameTableAction: "finance",
          nameRole: financeExist.id,
          idUser: financeExist.id,
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
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { idFinance } = req.body;
    if (!idFinance) return res.status(404).json(await error(res.statusCode));

    const financeExist = await Finance.findOneBy({
      idFinance: idFinance,
    });

    if (financeExist) {
      const result = await Finance.delete(idFinance);
      if (result) {
        await insertBitacora({
          nameTableAction: "finance",
          nameRole: financeExist.idFinance,
          idUser: financeExist.idFinance,
          userName: financeExist.idFinance,
          actionDetail: `Se Eliminó la finanza con Id: "${financeExist.idFinance}"`,
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
