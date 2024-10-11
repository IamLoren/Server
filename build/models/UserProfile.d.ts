import { Schema } from "mongoose";
declare const UserProfile: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
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
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: any;
    avatarURL: string;
    favorites: string[];
    history: string[];
    theme: "light" | "dark";
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>>;
export default UserProfile;
