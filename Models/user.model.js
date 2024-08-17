import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    email: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    photo: {
        type: String,
        default: null
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true }
)

export const User = mongoose.model("User", userSchema);