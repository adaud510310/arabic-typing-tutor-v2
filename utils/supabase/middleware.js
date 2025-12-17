import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
    const url = request.nextUrl.clone()

    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase environment variables')
        // Allow access to auth pages even if env vars are missing
        const authRoutes = ['/auth/login', '/auth/register', '/auth/error']
        if (authRoutes.some(route => url.pathname.startsWith(route)) || url.pathname === '/') {
            return NextResponse.next()
        }
        // Redirect to login for protected routes
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
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

        const { data: { user }, error } = await supabase.auth.getUser()

        // If there's an error getting user, allow access to public pages
        if (error) {
            console.error('Supabase auth error:', error.message)
            const publicRoutes = ['/auth/login', '/auth/register', '/auth/error', '/']
            if (publicRoutes.some(route => url.pathname.startsWith(route))) {
                return response
            }
            // Redirect to login for protected routes
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }

        // 1. Protected Routes (must be logged in)
        const protectedRoutes = ['/dashboard', '/lessons', '/test', '/profile']
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
                url.pathname = '/dashboard'
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

    } catch (error) {
        console.error('Middleware error:', error)
        // On any error, allow access to auth pages
        const safeRoutes = ['/auth/login', '/auth/register', '/auth/error', '/']
        if (safeRoutes.some(route => url.pathname.startsWith(route))) {
            return NextResponse.next()
        }
        // Redirect to login for other routes
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }
}
