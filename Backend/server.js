import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createDatabaseConnection from "./database.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Serveur fonctionne !");
});

const startServer = async () => {
  try {
    const database = await createDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`Le serveur fonctionne sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("Impossible de démarrer le serveur:", err);
  }
};

startServer();
