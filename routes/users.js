import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";

const router = express.Router();
const SECRET = "segredo";
const usuariosFile = "./utils/db.json";

const loadUsuarios = () => JSON.parse(fs.readFileSync(usuariosFile, "utf-8"));
const saveUsuarios = (db) => fs.writeFileSync(usuariosFile, JSON.stringify(db, null, 2));

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// Criar usúario
router.post("/", authMiddleware, (req, res) => {
  const { email } = req.body;
  const { senha } = req.body;
  const usuario = loadUsuarios();
  const nova = { id: Date.now(), usuario: req.user.username, email, senha };
  usuario.push(nova);
  saveUsuarios(usuario);
  res.json(nova);
});

// Listar usúario
router.get("/", authMiddleware, (req, res) => {
  const usuario = loadUsuarios().filter((m) => m.usuario === req.user.username);
  res.json(usuario);
});

// Atualizar usúario
router.put("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const { senha } = req.body;
  let usuario = loadUsuarios();
  const index = usuario.findIndex((m) => m.id == id && m.usuario === req.user.username);
  if (index === -1) return res.status(404).json({ message: "Usúario não encontrado" });
  usuario[index].email = email;
  usuario[index].senha = senha;
  saveUsuarios(usuario);
  res.json(usuario[index]);
});

// Deletar usúario
router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  let usuario = loadUsuarios();
  usuario = usuario.filter((m) => !(m.id == id && m.usuario === req.user.username));
  saveUsuarios(usuario);
  res.json({ message: "Usúario removido" });
});

export default router;