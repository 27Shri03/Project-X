import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        contentType: {
            type: String,
            enum: ['text', 'image', 'video' , 'voice']
        },
        contentLink: {
            type: String,
            default: null
        },
        content: {
            type: String,
            required: function () {
                return this.contentType === 'text';  // 'this' refers to the current message document
            }
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

export const Conversation = mongoose.model("Conversation", conversationSchema);