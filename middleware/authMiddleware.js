import jwt from 'jsonwebtoken';

// Esta é a palavra-chave secreta para verificar o token.
// DEVE ser a mesma utilizada no 'authController.js' para criar o token.
const JWT_SECRET = process.env.JWT_SECRET || 'secreta123';

function authMiddleware(req, res, next) {
  // 1. Procura pelo token no cabeçalho 'Authorization' da requisição.
  const authHeader = req.headers['authorization'];

  // 2. Se o cabeçalho não existir, significa que o utilizador não enviou o token.
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. O token não foi fornecido.' });
  }

  // 3. O formato do cabeçalho é "Bearer <token>". Separamos para obter apenas o token.
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  // 4. Tenta verificar se o token é válido e não expirou.
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Se for válido, adicionamos as informações do utilizador (que estavam no token) ao objeto 'req'.
    // Assim, as próximas funções (nos controladores) saberão quem é o utilizador.
    req.user = decoded;

    // 5. Permite que a requisição continue para a rota pretendida.
    next();
  } catch (error) {
    // Se 'jwt.verify' falhar (por ex., token inválido ou expirado), devolve um erro.
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

export default authMiddleware;

