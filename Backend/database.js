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
      console.log("Default admin added.");
    } else {
      console.log("Admin already present.");
    }
  } catch (err) {
    console.error("Error initializing admin:", err);
  }
};

const initializeDatabase = async () => {
  await initializeAdmin();
};

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release();
    await initializeDatabase();
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

testDatabaseConnection();

export default pool;
