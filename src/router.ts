import express from 'express';
import { routes } from './routes/index';

export const router = express.Router();

router.use('/client', routes.client);
router.use('/finance', routes.finance);
router.use('/', routes.root);
