import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        let payload;
        try {
            payload = await req.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
        }

        const { message, website } = payload;

        if (website) {
            return NextResponse.json({ success: true });
        }

        if (!message) {
            return NextResponse.json({ success: false, error: "message failed" }, { status: 400 });
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                user_id: session.user.id,
                user_name: session.user.name,
                user_email: session.user.email,
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
