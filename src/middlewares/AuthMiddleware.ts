import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request & {user?: any}, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
         const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Server configuration error" });
    }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }       
}