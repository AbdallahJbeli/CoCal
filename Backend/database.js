import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initializeAdmin = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = 'admin@cocal.com'"
    );

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("Admin@1234", 10);
      await pool.query(
        "INSERT INTO utilisateur (nom, email, motDePasse, typeUtilisateur) VALUES (?, ?, ?, ?)",
        ["Admin", "admin@cocal.com", hashedPassword, "admin"]
      );
      console.log("Admin par défaut ajouté.");
    } else {
      console.log("Admin déjà présent.");
    }
  } catch (err) {
    console.error("Erreur lors de l'initialisation de l'admin:", err);
  }
};

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connecté à la base de données");
    connection.release();
    await initializeAdmin();
  } catch (err) {
    console.error("Erreur de connexion à la base de données:", err);
    throw err;
  }
};

testDatabaseConnection();

export default pool;
