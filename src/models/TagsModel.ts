import mongoose, { model, Schema } from "mongoose";
import { getTypeParameterOwner } from "typescript";

const TagsSchema = new Schema({
    title: {
        type: String,
        required: true
    }

});

export const Tags = model('tags', TagsSchema);
