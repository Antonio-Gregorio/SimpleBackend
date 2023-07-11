import express from 'express';
import userRoutes from './userRoutes';
// import outras rotas, se necessário

const router = express.Router();

router.use('/auth', userRoutes);
// use outras rotas, se necessário

export default router;