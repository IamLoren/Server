import { Schema } from "mongoose";
declare const UserProfile: import("mongoose").Model<{
    userId: string;
    avatarURL: string;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    userId: string;
    avatarURL: string;
}> & {
    userId: string;
    avatarURL: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    userId: string;
    avatarURL: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: string;
    avatarURL: string;
}>> & import("mongoose").FlatRecord<{
    userId: string;
    avatarURL: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>>;
export default UserProfile;
