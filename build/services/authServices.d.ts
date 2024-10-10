import { IUserCredentials, signUpArguments } from "../types/authTypes";
import { FilterQuery } from "mongoose";
export declare const signUp: (data: signUpArguments) => Promise<import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const findUser: (filter: FilterQuery<IUserCredentials>) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}, "findOne", {}>;
export declare const findUserById: (id: any) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}, "findOne", {}>;
export declare const setToken: (id: string, token?: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string;
}, "findOneAndUpdate", {}>;
