import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import commercialRoutes from "./routes/commercialRoutes.js";
import chauffeurRoutes from "./routes/chauffeurRoutes.js";
import vehiculeRoutes from "./routes/vehiculesRoutes.js";
import pool from "./database.js";

dotenv.config();

const PORT = 5000;

const app = express();

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Private-Network", "true");
//   next();
// });

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);
app.use("/commercial", commercialRoutes);
app.use("/chauffeur", chauffeurRoutes);
app.use("/vehicules", vehiculeRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

pool
  .getConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server online on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to start the server:", err);
  });
