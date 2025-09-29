import express from 'express';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

// Inicializa a aplicação Express
const app = express();
const PORT = 3000;

// Middleware para permitir que o servidor entenda JSON no corpo das requisições
app.use(express.json());

// Define as rotas principais da aplicação
// Todas as rotas em 'authRoutes' serão prefixadas com /auth (ex: /auth/register)
app.use('/auth', authRoutes);

// Todas as rotas em 'usersRoutes' serão prefixadas com /users (ex: /users/)
app.use('/users', usersRoutes);

// Inicia o servidor e fá-lo escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta http://localhost:${PORT}`);
});

