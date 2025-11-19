import mongoose, { Schema } from "mongoose";
import { User } from "./UserModel.js";


const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: User
    }
})