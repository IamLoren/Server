import { Schema, model } from 'mongoose';
const userCredentialsSchema = new Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'firstName is required'],
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'lastName is required'],
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    // token: {
    //     type: String,
    //     default: null,
    // },
}, { versionKey: false, timestamps: true });
const UserCredentials = model('userCredentials', userCredentialsSchema);
export default UserCredentials;
//# sourceMappingURL=UserCredentials.js.map