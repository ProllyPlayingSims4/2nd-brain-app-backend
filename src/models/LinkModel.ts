import mongoose, { Schema, model } from "mongoose";
import { User } from "./UserModel.js";



const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        unique: true,
        required: true

    }

});

export const Link = model("Link", LinkSchema);