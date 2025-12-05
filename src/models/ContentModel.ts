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
    link: {
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
        ref: "User",
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "tags"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Content = model('Content', ContentSchema);
