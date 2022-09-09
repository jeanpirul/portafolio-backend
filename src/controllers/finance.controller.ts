import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { Finance } from '../entities_DB/finance';

export const createFinance = async (req: Request, res: Response) => {
	try {
		const { totalIncome, totalExpenses, purchaseDate, purchaseDetail } =
			req.body;

		const finance = new Finance();
		finance.totalIncome = totalIncome;
		finance.totalExpenses = totalExpenses;
		finance.purchaseDate = purchaseDate;
		finance.purchaseDetail = purchaseDetail;

		await finance.save();
		return res.json(finance);
	} catch (error) {
		console.log(error);
		//check if error is a instance of Error
		if (error instanceof Error) {
			//send a json response with the error message
			return res.status(500).json({ message: error.message });
		}
	}
};

export const getFinance = async (req: Request, res: Response) => {
	try {
		const finance = await Finance.find();
		!finance
			? res.status(404).json({ message: 'Detail Finance not found' })
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
			? res.status(404).json({ message: 'Finance not found' })
			: res.json({ listFinance: finance });
	} catch (error) {
		// console.log(error);
		// //check if error is instance of Error
		// if (error instanceof Error) {
		// 	//send a json response with the error message
		// 	return res.status(500).json({ message: error.message });
		// }
		throw error;
	}
};

export const updateFinance = async (req: Request, res: Response) => {
	try {
		const { id, totalIncome, totalExpenses, purchaseDate, purchaseDetail } =
			req.body;
		if (!id) return res.status(400).json({ message: 'Finance not found' });

		const financeExist: any = await Finance.findOneBy({
			id: id,
		});

		if (financeExist) {
			const result = await Finance.update(financeExist, {
				id: id,
				totalIncome: totalIncome,
				totalExpenses: totalExpenses,
				purchaseDate: purchaseDate,
				purchaseDetail: purchaseDetail,
			});
			return result
				? res
						.status(200)
						.json(await success({ data: result }, res.statusCode))
				: res.status(422).json(await error(res.statusCode));
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json(await error(res.statusCode));
	}
};

export const deleteFinance = async (req: Request, res: Response) => {
	try {
		const id = req.params;
		if (!id) return res.status(404).json(await error(res.statusCode));

		const result: any = await Finance.delete(id);
		return result
			? res
					.status(200)
					.json(await success({ data: result }, res.statusCode))
			: res.status(422).json(await error(res.statusCode));
	} catch (err) {
		console.log(err);
		return res.status(500).json(await error(res.statusCode));
	}
};
