import NextAuth, { DefaultSession } from "next-auth";
import { jwt } from 'jsonwebtoken';

declare module "next-auth"{
    interface User {
        _id ? : string;
        isVerified ? : boolean;
        isAcceptingMessage ? : boolean;
        username ? : string;
    }
    interface Session {
        user : {
            _id ? : string;
        isVerified ? : boolean;
        isAcceptingMessage ? : boolean;
        username ? : string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt"{
    interface JWT {
        _id ? : string;
        isVerified ? : boolean;
        isAcceptingMessage ? : boolean;
        username ? : string;
    }
}