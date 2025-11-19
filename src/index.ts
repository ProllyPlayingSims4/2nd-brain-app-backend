import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User, userRegisterSchema } from "./models/UserModel.js";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const hashPassword = async (password: string) =>{
    await bcrypt.hash(password, 10)
};

app.post("/api/v1/signup", async (req, res) => {
    // 1️⃣ Validate request body with Zod
    const parsed = userRegisterSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors
        });
    }

    // If validation passes, Zod gives you safe data:
    const { username, password } = parsed.data;
    //const { username, password } = req.body;
    
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            res.status(400).json({ message: "User already exists please Login" });
        }
        const hashedPassword = await hashPassword(password);

        await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({message: "User Signed Up Successfully"})
    } 
    catch (error) {
        console.error(error);
         res.status(500).json({message: "an error has occured", error: error})
    }
});
app.post("/api/v1/login", (req, res) => {

});
app.post("/api/v1/content", (req, res) => {

});
app.get("/api/v1/content", (req, res) => {

});
app.delete("/api/v1/content", (req, res) => {

});
app.post("/api/v1/brain/share", (req, res) => {

});
app.get("/api/v1/brain/:shareLink", (req, res) => {

});

app.listen(8000, () => {
    console.log("Server has been started on the PORT: 8000")
});