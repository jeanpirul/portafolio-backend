import { Request, Response } from 'express';
import { getRepository, InsertResult } from 'typeorm';
import { CreateClientDataDTO } from '../dto/client.dto';

export const createClient = async (
	req: Request,
	res: Response
): Promise<CreateClientDataDTO> => {
	try {
		console.log('Se ha solicitado la creación de la entidad Cliente');
		const { firstName, lastName } = req.body;
		const result: any = await getRepository;
	} catch (error) {}
};
