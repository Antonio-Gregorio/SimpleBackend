import express from 'express';
import { login, register, forgotPassword, refreshToken } from '../controllers/UserController';

const router = express.Router();

router.post('/', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/refresh-token', refreshToken);

export default router;