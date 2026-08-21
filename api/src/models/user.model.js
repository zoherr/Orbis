import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    googleUserId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    profileImage: {
        type: String
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;