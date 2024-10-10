export interface signUpArguments {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
}
export interface IUserCredentials {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: 'admin' | 'user';
    token: string | null;
}
