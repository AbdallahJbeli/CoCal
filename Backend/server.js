import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pool from "./database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Serveur fonctionne !");
});

pool
  .getConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur en ligne sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Impossible de démarrer le serveur:", err);
  });
