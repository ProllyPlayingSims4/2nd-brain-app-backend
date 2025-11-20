import {Schema, model} from "mongoose";
import z from "zod";

export const userRegisterSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(50),
});

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


export const User = model('User', UserSchema);

