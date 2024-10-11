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
        type: [String],
    },
    history: {
        type: [String],
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
    },
}, { versionKey: false, timestamps: true });
const UserProfile = model("userprofiles", userProfileSchema);
export default UserProfile;
//# sourceMappingURL=UserProfile.js.map