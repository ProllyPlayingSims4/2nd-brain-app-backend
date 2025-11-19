import mongoose, { model, Schema } from "mongoose";
import { User } from "./UserModel.js";
import { Tags } from "./TagsModel.js";

enum type {
    tweet = "tweet",
    insta = "insta",
    fb = "fb",
    youtube = "youtube"
}

const ContentSchema = new Schema({
    Link: {
        type: String, 
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(type),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    tags: {
        type: Schema.Types.ObjectId,
        ref: Tags
    }
});

export const Content = model('Content', ContentSchema);
