import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../../Models/user.model.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req, res) => {
    try {
        const { username, password, email } = req.body
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username , email and password are required" });
        }
        const user = await User.findOne({ username: username });
        if (user) {
            return res.status(400).json({ message: "User is already present" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            friends: []
        })
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        return res.status(201).json({
            message: "User created successfully",
            userId: newUser._id,
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const oldUser = await User.findOne({ email: email });
        if (!oldUser) {
            return res.status(404).json({ message: "User not found please signUp first" });
        }
        const isMatch = await bcrypt.compare(password, oldUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { userId: oldUser._id },
            JWT_SECRET,
            { expiresIn: '1d' }
        )
        return res.status(200).json({
            message: "Login successfull",
            userId: oldUser._id,
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server Error", error: error.message })
    }
}