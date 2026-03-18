import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { message } = body

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            )
        }

        // TEMP: remove auth() to avoid build error
        const { error } = await supabase
            .from("messages")
            .insert({
                name: "Anonymous",
                email: "anonymous@wauqle.com",
                message: message,
            })

        if (error) {
            console.error("Supabase error:", error)
            return NextResponse.json(
                { error: "Failed to insert message" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}