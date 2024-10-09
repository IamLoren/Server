import { Schema, model } from "mongoose";
import { emailRegexp } from "../constants/regexp";
const userCredentialsSchema = new Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, "firstName is required"]
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, "lastName is required"]
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 20,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: emailRegexp,
        unique: true,
    },
    token: {
        type: String,
        default: null,
    },
});
const UserCredentials = model("userCredentials", userCredentialsSchema);
export default UserCredentials;
