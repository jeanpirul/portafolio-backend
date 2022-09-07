import express from 'express';
import {
	createClient,
	getClient,
	getClientById,
	updateClient,
	deleteClient,
} from '../controllers/client.controllers';

const router = express.Router();

router.post('/', async (req, res) => {
	//este endpoint permite crear un nuevo cliente
	await createClient(req, res);
});

router.get('/', async (req, res) => {
	//Este endpoint permite listar todos los clientes existentes en la base de datos
	await getClient(req, res);
});

router.get('/:id', async (req, res) => {
	//Este endpoint permite listar 1 clientre existente en la base de datos por el ID
	await getClientById(req, res);
});

router.put('/', async (req, res) => {
	//Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
	await updateClient(req, res);
});

router.delete('/:id', async (req, res) => {
	/* Este endpoint permite eliminar los datos de cada 
	cliente existente en la base de datos segun el id */
	await deleteClient(req, res);
});

export default router;
