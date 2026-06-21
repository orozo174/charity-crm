// Бул сервер production build'ди (dist/) Node.js аркылуу кызмат кылат.
// Колдонуу: npm run build  →  node server.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Статикалык файлдар (JS, CSS, сүрөттөр)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback — бардык белгисиз route'тор index.html'ге багытталат
// (React Router баракты жаңыртканда 404 бербеши үчүн)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`КыргызЖардам CRM иштеп жатат: http://localhost:${PORT}`);
});
