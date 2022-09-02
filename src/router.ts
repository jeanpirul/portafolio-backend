import express from 'express';
import { routes } from './router/index';

export const router = express.Router();

router.use('/', routes.root);
