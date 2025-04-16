import express from "express";
import bcyprt from "bcrypt";
import pool from "../database";
import { verifyClient } from "../middlewares/authMiddleware.js";

const router = express.Router();
