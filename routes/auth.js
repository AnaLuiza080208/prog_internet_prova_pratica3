import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

const db = [];

// Registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const userExist = db.find(u => u.username === username);
  if (userExist) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.push({ username, email, password: hashedPassword });

  res.json({ message: "Usuário registrado com sucesso" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = db.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: "Senha inválida" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "111111", { expiresIn: "1h" });
  res.json({ token });
});

// Rota protegida
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}` });
  res.json({ message: `Email, ${req.user.email}` });
  res.json({ message: `Senha, ${req.user.password}` });
});

export default router;