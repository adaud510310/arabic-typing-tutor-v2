import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // 1. Protected Routes (must be logged in)
    const protectedRoutes = ['/dashboard', '/lessons', '/test', '/profile']
    // Check if current path starts with any protected route
    if (protectedRoutes.some(route => url.pathname.startsWith(route))) {
        if (!user) {
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }
    }

    // 2. Admin Route Protection
    if (url.pathname.startsWith('/admin')) {
        if (!user) {
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }
        // Strict Email Check
        if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            url.pathname = '/dashboard' // Redirect unauthorized users to dashboard
            return NextResponse.redirect(url)
        }
    }

    // 3. Auth Routes (redirect to dashboard if already logged in)
    const authRoutes = ['/auth/login', '/auth/register']
    if (authRoutes.some(route => url.pathname.startsWith(route))) {
        if (user) {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return response
}
