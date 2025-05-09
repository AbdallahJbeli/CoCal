import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY is not defined in environment variables.");
}

const ERRORS = {
  AUTH_HEADER: "Authorization header missing or malformed.",
  ROLE: "Access denied. Your role does not have permission to access this resource.",
  EXPIRED: "Access denied. Your session has expired. Please log in again.",
  INVALID: "Access denied. Invalid authentication token.",
  SERVER: "Internal server error during token verification.",
};

const errorResponse = (res, status, message) =>
  res.status(status).json({ error: message });

export const verifyRole =
  (...requiredRoles) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(res, 401, ERRORS.AUTH_HEADER);
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      const userRole = decodedToken.typeUtilisateur;

      if (!requiredRoles.includes(userRole)) {
        return errorResponse(res, 403, ERRORS.ROLE);
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      console.error(`JWT Verification Error on ${req.path}:`, err);

      if (err.name === "TokenExpiredError") {
        return errorResponse(res, 401, ERRORS.EXPIRED);
      }
      if (err.name === "JsonWebTokenError") {
        return errorResponse(res, 401, ERRORS.INVALID);
      }
      return errorResponse(res, 500, ERRORS.SERVER);
    }
  };

export const verifyAdmin = verifyRole("admin");
export const verifyClient = verifyRole("client");
export const verifyCommercial = verifyRole("commercial");
export const verifyChauffeur = verifyRole("chauffeur");
