import express from 'express';
import { routes } from './routes/index';

export const router = express.Router();

router.use('/', routes.root);
