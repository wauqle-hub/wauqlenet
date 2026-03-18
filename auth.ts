import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Pass the user's first name to the session
            if (session.user && session.user.name) {
                session.user.firstName = session.user.name.split(" ")[0];
            }
            return session;
        },
    },
});

// Extend the session type to include firstName
declare module "next-auth" {
    interface Session {
        user: {
            firstName?: string;
        } & DefaultSession["user"];
    }
}

import { DefaultSession } from "next-auth";
