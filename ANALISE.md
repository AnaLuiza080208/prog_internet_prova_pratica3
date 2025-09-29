📦 Análise Completa do Código-Fonte Inicial - API CRUD JWT
Este documento apresenta uma análise técnica detalhada de todos os ficheiros iniciais desenvolvidos para o projeto da API Back-End. O objetivo é fornecer um diagnóstico completo, destacando os acertos, os desafios estruturais, as inconsistências lógicas e as vulnerabilidades de segurança para guiar o processo de refatoração.

Análise Geral: Um Projeto Fragmentado
Os códigos iniciais demonstram um bom entendimento isolado de cada tecnologia (Express, JWT, bcryptjs). No entanto, o projeto como um todo funcionava de forma fragmentada, como um conjunto de peças que ainda não tinham sido conectadas.

As principais questões eram:

Inconsistência Lógica: Ficheiros diferentes usavam estratégias diferentes para os mesmos problemas (ex: persistência de dados em memória vs. em ficheiro).

Duplicação de Código: Lógicas semelhantes (como o middleware de autenticação) foram escritas em locais diferentes.

Falta de Separação de Responsabilidades: A lógica de negócio estava misturada com a definição das rotas, contrariando a arquitetura proposta.

Vulnerabilidades de Segurança: Havia falhas críticas, como o armazenamento de senhas em texto puro.

Análise Detalhada por Ficheiro
1. server.js
O ponto de entrada da aplicação.

✅ Pontos Positivos
A estrutura base do servidor Express estava corretamente configurada.

Havia uma tentativa clara de modularizar as rotas, importando authRoutes e usersRoutes.

🛠️ Pontos a Melhorar / Desafios
Erro na Importação de Rota: A linha import usersRoutes from "./routes/matricula.js"; continha um caminho incorreto, o que impediria o servidor de iniciar corretamente.

Uso de body-parser: A importação de bodyParser não era estritamente necessária, pois as versões recentes do Express incluem o express.json(), que tem a mesma finalidade.

2. middleware/auth.js
Responsável por proteger as rotas.

✅ Pontos Positivos
A lógica para extrair o token do cabeçalho Authorization (formato Bearer <token>) estava correta.

O uso de um bloco try...catch para a verificação do JWT (jwt.verify) é uma excelente prática para lidar com tokens inválidos ou expirados.

🛠️ Pontos a Melhorar / Desafios
Segredo do JWT "Hardcoded": O segredo ('secreta123') estava fixo no código. Para maior segurança, deveria ser gerido através de variáveis de ambiente.

Lógica Duplicada: O ficheiro routes/users.js também continha a sua própria implementação de um authMiddleware, criando duplicação e inconsistência.

3. routes/auth.js (Primeira Versão)
Focado no registo e login.

✅ Pontos Positivos
Hashing de Senhas: Utilização correta de bcrypt.hash() no registo e bcrypt.compare() no login.

Geração de Token: O JWT era gerado com sucesso no login, incluindo um tempo de expiração.

🛠️ Pontos a Melhorar / Desafios
🚨 Persistência em Memória: O uso de const db = []; era o problema mais crítico. Todos os dados seriam perdidos ao reiniciar o servidor.

Lógica Misturada: Toda a lógica de negócio estava acoplada às rotas, em vez de estar nos controladores.

Rota /profile com Erros: A rota de teste tentava enviar múltiplas respostas (res.json()), o que causa um erro no Node.js.

4. routes/users.js (Primeira Versão)
Implementação do CRUD de utilizadores.

✅ Pontos Positivos
Persistência em Ficheiro: Utilizava fs para ler e escrever no db.json, o que estava alinhado com os requisitos.

Estrutura do CRUD: As rotas GET, POST, PUT e DELETE estavam bem definidas.

🛠️ Pontos a Melhorar / Desafios
🚨 Falha Grave de Segurança: A senha era guardada em texto puro no db.json nas rotas de criação e atualização, uma vulnerabilidade crítica.

Inconsistência de Dados: O modelo de dados ({ id, usuario, email, senha }) era diferente do modelo usado em auth.js ({ username, email, password }).

Segredos de JWT Diferentes: O segredo usado para verificar o token ("segredo") era diferente do usado para criá-lo em auth.js ("111111"), o que faria com que a autenticação falhasse sempre.

5. utils/db.js e db.json
Ficheiros para a gestão de dados.

Análise
db.json começava corretamente com [].

utils/db.js estava vazio. O problema era que a lógica de manipulação do ficheiro, que deveria estar centralizada aqui, estava espalhada dentro de routes/users.js. Isto dificultava a manutenção e impedia que routes/auth.js utilizasse a mesma persistência.

Conclusão e Recomendações de Refatoração
O estado inicial do projeto era o de um protótipo funcional em partes, mas que precisava de uma refatoração significativa para se tornar uma aplicação coesa, segura e manutenível.

Os passos recomendados foram:

Centralizar a Lógica de Dados: Mover todas as funções de leitura e escrita do db.json para utils/db.js.

Separar Responsabilidades: Mover toda a lógica de negócio dos ficheiros de rotas para os controllers (authController.js e usersController.js).

Unificar a Persistência: Fazer com que todos os controladores utilizassem as funções de utils/db.js, garantindo que todos os dados fossem guardados no db.json.

Padronizar a Aplicação: Usar um único segredo para o JWT e um modelo de dados consistente para o utilizador.

Corrigir Falhas de Segurança: Garantir que nenhuma senha seja guardada sem antes passar pelo bcrypt.hash().