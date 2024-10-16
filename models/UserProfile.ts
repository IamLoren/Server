import { Schema, model } from "mongoose";

const userProfileSchema = new Schema({
    userId: {
        type: Object,
        required: [true, "userId is required"]
    },
    avatarURL: {
        type: String,
        default: null,
    },
    favorites: {
        type: Array,
    },
    history: {
        type: Array,
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
    },
},
{ versionKey: false, timestamps: true })

const UserProfile = model("userprofiles", userProfileSchema);

export default UserProfile;