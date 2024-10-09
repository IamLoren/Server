import { Schema, model } from "mongoose";
import {emailRegexp} from "../constants/regexp";

const userProfileSchema = new Schema({
    userId: {
        type: String,
        required: [true, "userId is required"]
    },
    avatarURL: {
        type: String,
        default: null,
    },
    // favorite: {
    //     type: String,
    // },
    

})

const UserProfile = model("userProfile", userProfileSchema);

export default UserProfile;