import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Finance } from "../entities_DB/finance";
import { insertBitacora } from "./action.controller";
import * as jwt from "jsonwebtoken";

export const createFinance = async (req: Request, res: Response) => {
  try {
    const {
      userName,
      totalIncome,
      totalExpenses,
      purchaseDate,
      purchaseDetail,
    } = req.body;

    const result = await Finance.save({
      userName: userName,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      purchaseDate: purchaseDate,
      purchaseDetail: purchaseDetail,
    });

    await insertBitacora({
      nameTableAction: "finance",
      nameRole: result.id,
      idUser: result.id,
      userName: result.userName,
      actionDetail: `Creación de nueva cuenta del usuario: "${result.userName}" responsable de la caja.`,
    });

    res.status(201).json({
      message: "Finanza registrada exitosamente!",
      result,
    });
  } catch (error) {
    //check if error is a instance of Error
    console.log("Error de creación", error);
    //send a json response with the error message
    res.status(500).json({
      //Database connection error
      error: "Error en la base de datos al registrar una nueva finanza!",
    });
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
  const { id } = req.params;
  try {
    const finance = await Finance.findOneBy({
      id: id,
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
  try {
    const decodedToken: any = jwt.decode(
      req.headers.authorization
        ? req.headers.authorization.toString().replace("Bearer ", "")
        : ""
    );

    const { id, userName, totalIncome, totalExpenses, purchaseDetail } =
      req.body;
    if (!id) return res.status(400).json({ message: "Finance not found" });

    const financeExist: any = await Finance.findOneBy({
      id: id,
    });

    if (financeExist) {
      const result = await Finance.update(financeExist, {
        id: id,
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
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const deleteFinance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json(await error(res.statusCode));

    const financeExist = await Finance.findOneBy({
      id: id,
    });

    if (financeExist) {
      const result = await Finance.delete(id);
      if (result) {
        await insertBitacora({
          nameTableAction: "finance",
          nameRole: financeExist.id,
          idUser: financeExist.id,
          userName: financeExist.id,
          actionDetail: `Se Eliminó la finanza con Id: "${financeExist.id}"`,
        });

        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
  } catch (err) {
    return res.status(500).json(await error(res.statusCode));
  }
};
