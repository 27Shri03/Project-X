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
            friends: [],
            friendRequests: []
        })
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        )
        const userData = {
            username: newUser.username,
            userId: newUser._id,
            friends: [],
            friendRequests: []
        }

        return res.status(201).json({
            message: "User created successfully",
            token: token,
            userData: userData
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const entity = email || username; // Use email if provided, otherwise use username

        if (!entity || !password) {
            return res.status(400).json({ message: "Email or username and password are required" });
        }
        const query = email ? { email: email } : { username: username };
        const oldUser = await User.findOne(query)
            .populate('friends', 'username photo')
            .populate('friendRequests.user', 'username photo');
        if (!oldUser) {
            return res.status(404).json({ message: "User not found please signUp first" });
        }
        const isMatch = await bcrypt.compare(password, oldUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const userData = {
            username: oldUser.username,
            userId: oldUser._id,
            friends: oldUser.friends.map((friend) => ({
                username: friend.username,
                photo: friend.photo
            })),
            friendRequests: oldUser.friendRequests.map(request => ({
                user: {
                    username: request.user.username,
                    photo: request.user.photo
                },
                createdAt: request.createdAt
            }))
        }

        const token = jwt.sign(
            { userId: oldUser._id, username: oldUser.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        )
        return res.status(200).json({
            message: "Login successfully",
            token: token,
            userData: userData
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server Error", error: error.message })
    }
}