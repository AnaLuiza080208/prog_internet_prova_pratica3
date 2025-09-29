import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { loadUsers, saveUsers } from '../utils/db.js';

// Esta é a palavra-chave secreta para criar e verificar o token.
// DEVE ser a mesma utilizada no 'middleware/auth.js'.
const JWT_SECRET = process.env.JWT_SECRET || 'secreta123';

/**
 * Regista um novo utilizador.
 * Rota: POST /register
 */
export const registerUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação para garantir que todos os campos foram enviados
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    const users = loadUsers();

    // Verifica se o email já existe no "banco de dados"
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Criptografa a senha antes de guardar
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o objeto do novo utilizador com um ID único
    const newUser = {
      id: uuidv4(), // Gera um ID universalmente único
      nome,
      email,
      senha: hashedPassword,
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar registar o utilizador.' });
  }
};

/**
 * Autentica um utilizador e devolve um token JWT.
 * Rota: POST /login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);

    // Verifica se o utilizador existe
    if (!user) {
      return res.status(404).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // Compara a senha enviada com a senha criptografada que está guardada
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // Se as credenciais estiverem corretas, gera o token
    const token = jwt.sign(
      { id: user.id, nome: user.nome }, // Informações que estarão dentro do token
      JWT_SECRET,
      { expiresIn: '1h' } // O token expira em 1 hora
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar fazer login.' });
  }
};

