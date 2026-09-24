import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function applyRateLimit(ip: string) {
    const now = Date.now();
    let record = rateLimitMap.get(ip);
    
    if (!record || (now - record.lastReset > RATE_LIMIT_WINDOW)) {
        record = { count: 1, lastReset: now };
    } else {
        record.count++;
    }
    
    rateLimitMap.set(ip, record);
    return record.count <= RATE_LIMIT;
}

// Allowed origins for CORS and CSRF
const ALLOWED_ORIGINS = [
    'https://www.wauqle.net',
    'https://wauqle.net',
    'http://localhost:3000'
];

export async function OPTIONS(req: Request) {
    const origin = req.headers.get('origin') || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }
    return new NextResponse(null, { status: 403 });
}

export async function POST(req: Request) {
    try {
        const origin = req.headers.get('origin');
        
        // Strict CSRF and CORS Check
        if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
            return new NextResponse(JSON.stringify({ success: false, error: "Forbidden Origin" }), { 
                status: 403, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (!applyRateLimit(ip)) {
            return new NextResponse(JSON.stringify({ success: false, error: "Too many requests" }), { 
                status: 429, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }

        const session = await auth();

        let payload;
        try {
            payload = await req.json();
        } catch (e) {
            return new NextResponse(JSON.stringify({ success: false, error: "Invalid JSON" }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }

        let { message, website, guestName, guestEmail } = payload;

        // Honeypot check
        if (website) {
            return new NextResponse(JSON.stringify({ success: true }), { 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }

        // Input Validation & Sanitization
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return new NextResponse(JSON.stringify({ success: false, error: "Invalid message" }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }
        
        // Basic sanitization: strip potential HTML tags
        message = message.replace(/<[^>]*>?/gm, '').substring(0, 5000);
        guestName = guestName ? guestName.replace(/<[^>]*>?/gm, '').substring(0, 100) : null;
        guestEmail = guestEmail ? guestEmail.replace(/<[^>]*>?/gm, '').substring(0, 255) : null;

        // Require either a session OR a valid guestEmail
        const isGuest = !session?.user && guestName && guestEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail);
        if (!session?.user && !isGuest) {
            return new NextResponse(JSON.stringify({ success: false, error: "Unauthorized" }), { 
                status: 401, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }

        const userName = session?.user?.name || guestName;
        const userEmail = session?.user?.email || guestEmail;
        const userId = session?.user?.id || "guest";

        // Supabase uses PostgREST which inherently uses parameterized queries, preventing SQLi
        const { error } = await supabase
            .from('messages')
            .insert({
                user_id: userId,
                user_name: userName,
                user_email: userEmail,
                message: message,
            });

        if (error) {
            console.error('Database insertion error'); // Avoid leaking exact DB error
            return new NextResponse(JSON.stringify({ success: false, error: "Internal Server Error" }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
            });
        }

        return new NextResponse(JSON.stringify({ success: true }), { 
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } 
        });
    } catch (error) {
        console.error('API Error Occurred'); // Avoid leaking stack trace
        return new NextResponse(JSON.stringify({ success: false, error: "Internal Server Error" }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
