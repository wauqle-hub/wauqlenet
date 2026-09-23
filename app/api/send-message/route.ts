import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();

        let payload;
        try {
            payload = await req.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
        }

        const { message, website, guestName, guestEmail } = payload;

        if (website) {
            return NextResponse.json({ success: true });
        }

        if (!message) {
            return NextResponse.json({ success: false, error: "message failed" }, { status: 400 });
        }

        // Require either a session OR a guestName & guestEmail
        const isGuest = !session?.user && guestName && guestEmail;
        if (!session?.user && !isGuest) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const userName = session?.user?.name || guestName;
        const userEmail = session?.user?.email || guestEmail;
        const userId = session?.user?.id || "guest";

        const { error } = await supabase
            .from('messages')
            .insert({
                user_id: userId,
                user_name: userName,
                user_email: userEmail,
                message: message,
            });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: "message failed" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: "message failed" }, { status: 500 });
    }
}
