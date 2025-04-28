import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token && (
        url.pathname.startsWith("/signin") ||
        url.pathname.startsWith("/signup") ||
        url.pathname.startsWith("/verify")
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

// matcher sahi karo — sab sahi route likho
export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/verify',
        '/dashboard',
    ],
}
