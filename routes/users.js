import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Aplica o middleware de autenticação a TODAS as rotas deste ficheiro.
// Isto significa que nenhuma destas rotas pode ser acedida sem um token JWT válido.
router.use(authMiddleware);

// --- Rotas do CRUD de Utilizadores (Protegidas) ---

// Rota para listar todos os utilizadores
// Corresponde a GET http://localhost:3000/users
router.get('/', getAllUsers);

// Rota para obter um utilizador específico pelo seu ID
// Corresponde a GET http://localhost:3000/users/:id
router.get('/:id', getUserById);

// Rota para atualizar um utilizador pelo seu ID
// Corresponde a PUT http://localhost:3000/users/:id
router.put('/:id', updateUser);

// Rota para remover um utilizador pelo seu ID
// Corresponde a DELETE http://localhost:3000/users/:id
router.delete('/:id', deleteUser);

export default router;

