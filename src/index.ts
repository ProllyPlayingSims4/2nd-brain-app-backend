import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User, userRegisterSchema } from "./models/UserModel.js";
import bcrypt from "bcryptjs";
import { authMiddleware } from "./middlewares/AuthMiddleware.js";
import { Content } from "./models/ContentModel.js";
import connection from "./db.js";
import { Tags } from "./models/TagsModel.js";
import cors from "cors";
import { Link } from "./models/LinkModel.js";
import { Random } from "./utils.js";

const app = express();
app.use(express.json());
app.use(cors());
const secret = process.env.JWT_SECRET

const hashPassword = async (password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
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

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: "User already exists please Login" });
        }
        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            password: hashedPassword
        })
        const token = jwt.sign({ id: newUser._id }, secret!);
        res.status(201).json({ message: "User Signed Up Successfully", token: token })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "an error has occured", error: error })
    }
});

app.post("/api/v1/login", async (req, res) => {
    const parsed = userRegisterSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors
        });
    }
    const { username, password } = parsed.data;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "No User found with the entered username, Please Sign Up" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({
            id: user._id
        }, secret!)
        res.status(200).json({ message: "Login Successful", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "an error has occured", error: error })
    }
});

app.post("/api/v1/content", authMiddleware, async (req, res) => {
    const { link, type, title, tags = [] } = req.body;
    //@ts-ignore
    const userId = req.user.id;
    try {
        //first find out if the entered tags already exist or not
        const tagsId = [];
        for (const tagsTitle of tags) {
            let existingTags = await Tags.findOne({ title: tagsTitle.trim().toLowerCase() });
            if (!existingTags) {
                existingTags = await Tags.create({
                    title: tagsTitle.trim().toLowerCase()
                });
            }
            tagsId.push(existingTags._id);
        }

        const content = await Content.create({
            link,
            type,
            title,
            userId,
            tags: tagsId
        });
        res.status(200).json({ message: "The content has been created", content: content });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "there is an error while creating content", error: e })
    }

});

app.get("/api/v1/content", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const content = await Content.find({ userId: userId }).populate("userId", "username").populate("tags", "title");
        res.status(200).json({ message: "got the conntent successfully", content: content });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "there is an error while getting the content", error: e })
    }
});

app.delete("/api/v1/content", authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.user.id;
    const id = req.body.id;
    try {
        const isDeleted = await Content.findByIdAndDelete({ _id: id, userId: userId });
        res.status(200).json({ message: "requested content has been deleted", deleted: isDeleted })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "there is an error while deleting", error: e })
    }

});

app.post("/api/v1/brain/share", authMiddleware, async (req, res) => {
    const { share } = req.body;
    try {
        if (share) {
            const ifexisting = await Link.findOne({
                //@ts-ignore
                userId: req.user.id
            });
            if(ifexisting){
                res.status(200).json({message: "Link already exist", Link: ifexisting.hash});
                return;
            }
           const NewLink = await Link.create({
                //@ts-ignore
                userId: req.user.id,
                hash: Random(10)
            });
            res.status(200).json({ message: "Shareable Link Created Successfully", Link: NewLink.hash});
        } else {
            await Link.deleteOne({
                //@ts-ignore
                userId: req.user.id
            });
            res.status(200).json({message: "Link Deleted Successfully"})
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "there is an error", error: e })
    }

});
app.get("/api/v1/brain/:shareLink", authMiddleware, async (req, res) => {
    const shareLink = req.params.shareLink;
    try {
        const findHash = await Link.findOne({
            hash: shareLink
        });
        if (!findHash) {
            res.status(411).json({ message: "Incorrect Url" })
            return;
        }
        const content = await Content.find({
            userId: findHash.userId
        }).populate("userId", "username").populate("tags", "title");
        res.status(200).json({ message: "here is the brain", content: content })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "some error occured", error: e })
    } 
});

if (connection) {
    app.listen(3000);
    console.log('app is listening on the PORT: 3000');
}