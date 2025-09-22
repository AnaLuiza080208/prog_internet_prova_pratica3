import movies from "../utils/db.js";

export const getAllDados = ((req, res) => {
    console.log("Função getAllDados foi chamada!");
    res.json(movies);
});