import express from 'express';
import {
	createFinance,
	getFinance,
	getFinanceById,
	updateFinance,
	deleteFinance,
} from '../controllers/finance.controller';

const router = express.Router();

router.post('/', async (req, res) => {
	//este endpoint permite crear un nuevo financee
	await createFinance(req, res);
});

router.get('/', async (req, res) => {
	//Este endpoint permite listar todos los financees existentes en la base de datos
	await getFinance(req, res);
});

router.get('/:id', async (req, res) => {
	//Este endpoint permite listar 1 financere existente en la base de datos por el ID
	await getFinanceById(req, res);
});

router.put('/', async (req, res) => {
	//Este endpoint permite actualizar los datos de cada clienmte existente en la base de datos
	await updateFinance(req, res);
});

router.delete('/:id', async (req, res) => {
	/* Este endpoint permite eliminar los datos de cada 
	financee existente en la base de datos segun el id */
	await deleteFinance(req, res);
});

export default router;
