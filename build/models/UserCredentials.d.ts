import { Schema } from 'mongoose';
declare const UserCredentials: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    versionKey: false;
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>>;
export default UserCredentials;
