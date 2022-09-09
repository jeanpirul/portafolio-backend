import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send('Se ha conectado correctamente.');
});

router.get('/user', (req, res) => {
	res.status(200).send([
		{
			id: '1',
			name: 'Jean',
			lastName: 'Pirul',
		},
		{
			id: '2',
			name: 'Cri',
			lastName: 'xikito',
		},
	]);
});

export default router;
