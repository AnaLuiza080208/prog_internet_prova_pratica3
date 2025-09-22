# 📦 CRUD JWT JSON

API de exemplo construída com **Node.js**, **Express**, **JWT** e persistência em **arquivo JSON**.  
Implementa **CRUD de usuários** e autenticação baseada em token.  

---

## 🚀 Tecnologias
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [uuid](https://www.npmjs.com/package/uuid)
- [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) (para testes)

---

## 📂 Estrutura do Projeto
├─ db.json
├─ server.js
├─ utils/
│  └─ db.js
├─ middleware/
│  └─ auth.js
├─ controllers/
│  ├─ authController.js
│  └─ usersController.js
└─ routes/
   ├─ auth.js
   └─ users.js

