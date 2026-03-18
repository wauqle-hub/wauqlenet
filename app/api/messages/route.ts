import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                name: session.user.name,
                email: session.user.email,
                message: message,
            });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to insert message' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}