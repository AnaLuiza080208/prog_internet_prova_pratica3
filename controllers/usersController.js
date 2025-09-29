import bcrypt from 'bcryptjs';
import { loadUsers, saveUsers } from '../utils/db.js';

/**
 * Lista todos os utilizadores.
 * Rota: GET /users
 */
export const getAllUsers = (req, res) => {
  try {
    const users = loadUsers();
    // É crucial remover a senha da resposta por segurança
    const usersToReturn = users.map(u => {
      const { senha, ...user } = u; // "Desestrutura" o objeto, tirando a senha
      return user;
    });
    res.json(usersToReturn);
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar listar os utilizadores.' });
  }
};

/**
 * Procura um utilizador específico pelo ID.
 * Rota: GET /users/:id
 */
export const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const users = loadUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Também remove a senha do retorno
    const { senha, ...userToReturn } = user;
    res.json(userToReturn);
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar obter o utilizador.' });
  }
};

/**
 * Atualiza os dados de um utilizador.
 * Rota: PUT /users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    let users = loadUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Atualiza apenas os campos que foram enviados na requisição
    if (nome) users[userIndex].nome = nome;
    if (email) users[userIndex].email = email;
    if (senha) {
      // Se uma nova senha for fornecida, ela deve ser criptografada
      users[userIndex].senha = await bcrypt.hash(senha, 10);
    }

    saveUsers(users);

    // Remove a senha do objeto antes de enviá-lo na resposta
    const { senha: _, ...updatedUser } = users[userIndex];
    res.json({ message: 'Utilizador atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar atualizar o utilizador.' });
  }
};

/**
 * Remove um utilizador.
 * Rota: DELETE /users/:id
 */
export const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    let users = loadUsers();
    const initialLength = users.length;

    // Filtra a lista, mantendo todos os utilizadores exceto o que tem o ID a ser apagado
    users = users.filter(u => u.id !== id);

    // Se o tamanho da lista não mudou, o utilizador não foi encontrado
    if (users.length === initialLength) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    saveUsers(users);
    res.status(200).json({ message: 'Utilizador removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar remover o utilizador.' });
  }
};

