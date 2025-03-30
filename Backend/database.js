import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createDatabaseConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Connecté à la base de données");
    return connection;
  } catch (err) {
    console.error("Erreur de connexion à la base de données:", err);
    throw err;
  }
};

export default createDatabaseConnection;
