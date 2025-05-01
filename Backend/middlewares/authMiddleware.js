import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY is not defined in environment variables.");
}

const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

export const verifyRole =
  (...requiredRoles) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      const userRole = decodedToken.role || decodedToken.typeUtilisateur;

      if (!requiredRoles.includes(userRole)) {
        return errorResponse(
          res,
          403,
          "Access denied. Insufficient permissions."
        );
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      console.error(`JWT Verification Error on ${req.path}:`, err.message);

      if (err.name === "TokenExpiredError") {
        return errorResponse(res, 401, "Token expired.");
      } else if (err.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid token.");
      }

      return errorResponse(res, 500, "Server error during token verification.");
    }
  };

export const verifyAdmin = verifyRole("admin");
export const verifyClient = verifyRole("client");
export const verifyCommercial = verifyRole("commercial");
