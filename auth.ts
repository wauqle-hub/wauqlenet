import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { OAuth2Client } from "google-auth-library";

const googleAuthClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            id: "google-one-tap",
            name: "Google One Tap",
            credentials: {
                credential: { type: "text" },
            },
            authorize: async (credentials) => {
                const token = credentials.credential as string;
                if (!token) {
                    throw new Error("Missing Google ID Token");
                }

                try {
                    const ticket = await googleAuthClient.verifyIdToken({
                        idToken: token,
                        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    });

                    const payload = ticket.getPayload();
                    if (!payload) {
                        throw new Error("Invalid Google ID Token");
                    }

                    return {
                        id: payload.sub,
                        name: payload.name,
                        email: payload.email,
                        image: payload.picture,
                    };
                } catch (error) {
                    console.error("Error verifying Google ID token:", error);
                    return null;
                }
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
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
