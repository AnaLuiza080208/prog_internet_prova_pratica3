import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Esta configuração é necessária para encontrar o caminho correto do ficheiro em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O caminho para o ficheiro db.json, que está na pasta raiz do projeto
const dbPath = path.join(__dirname, '../db.json');

/**
 * Lê os utilizadores do ficheiro db.json.
 * @returns {Array} Array de utilizadores.
 */
export const loadUsers = () => {
  try {
    // Se o ficheiro não existir, cria um com um array vazio
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '[]', 'utf8');
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    // Se o ficheiro estiver vazio, devolve um array vazio para evitar erros
    if (!data) {
        return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler o ficheiro db.json:", error);
    return [];
  }
};

/**
 * Escreve o array de utilizadores no ficheiro db.json.
 * @param {Array} users - O array de utilizadores para guardar.
 */
export const saveUsers = (users) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error("Erro ao guardar no ficheiro db.json:", error);
  }
};

