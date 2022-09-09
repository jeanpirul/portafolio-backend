import { Request, Response } from 'express';
import { error, success } from '../config/responseApi';
import { Client } from '../entities_DB/client';

const checkCreateClientParams = (req: Request, res: Response) => {
	if (!req.body.firstName) {
		res.status(404).send('firstName parameter not found.');
	} else if (!req.body.lastName) {
		res.status(404).send('lastName parameter not found.');
	} else if (!req.body.email) {
		res.status(404).send('email parameter not found.');
	} else if (!req.body.phone) {
		res.status(404).send('phone parameter not found.');
	} else if (typeof req.body.firstName != 'string') {
		res.status(400).send('firstName parameter has to be a string');
	} else if (typeof req.body.lastName != 'string') {
		res.status(400).send('lastName parameter has to be a string');
	} else if (typeof req.body.email != 'string') {
		res.status(400).send('email parameter has to be a string');
	} else if (typeof req.body.email != 'number') {
		res.status(400).send('email parameter has to be a number');
	}
	return true;
};

export const createClient = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, phone } = req.body;
		const client = new Client();
		client.firstName = firstName;
		client.lastName = lastName;
		client.email = email;
		client.phone = phone;

		await client.save();
		return res.json(client);
	} catch (error) {
		console.log(error);
		//check if error is a instance of Error
		if (error instanceof Error) {
			//send a json response with the error message
			return res.status(500).json({ message: error.message });
		}
	}
};

export const getClient = async (req: Request, res: Response) => {
	try {
		const client = await Client.find();
		!client
			? res.status(404).json({ message: 'No users found' })
			: res.json({ listClient: client });
	} catch (error) {
		console.log(error);
		//check if error is instance of Error

		if (error instanceof Error) {
			//send a json response with the error message
			return res.status(500).json({ message: error.message });
		}
	}
};

export const getClientById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const client = await Client.findOneBy({
			id: id,
		});

		!client
			? res.status(404).json({ message: 'No client found' })
			: res.json({ listClient: client });
	} catch (error) {
		console.log(error);
		//check if error is instance of Error
		if (error instanceof Error) {
			//send a json response with the error message
			return res.status(500).json({ message: error.message });
		}
	}
};

export const updateClient = async (req: Request, res: Response) => {
	try {
		const { id, firstName, lastName, email, phone } = req.body;
		if (!id) return res.status(400).json({ message: 'Client not found' });

		const clienteExist: any = await Client.findOneBy({
			id: id,
		});

		if (clienteExist) {
			const result = await Client.update(clienteExist, {
				id: id,
				firstName: firstName,
				lastName: lastName,
				email: email,
				phone: phone,
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

export const deleteClient = async (req: Request, res: Response) => {
	try {
		const id = req.params;
		if (!id) return res.status(404).json(await error(res.statusCode));

		const result: any = await Client.delete(id);
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
