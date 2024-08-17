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
    ],
    friendRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true }
)

export const User = mongoose.model("User", userSchema);