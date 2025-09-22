import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/matricula.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));