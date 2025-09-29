import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

// Rota para registar um novo utilizador
// Corresponde a POST http://localhost:3000/auth/register
router.post('/register', registerUser);

// Rota para fazer login
// Corresponde a POST http://localhost:3000/auth/login
router.post('/login', loginUser);

export default router;

