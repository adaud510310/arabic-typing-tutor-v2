'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Login Error:', error)
        redirect('/auth/error?message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createClient()

    const email = formData.get('email')
    const password = formData.get('password')
    const fullName = formData.get('fullName')

    // Validate Triple Name
    const nameParts = fullName ? fullName.trim().split(/\s+/) : []
    if (nameParts.length < 3) {
        redirect('/auth/error?message=TripleNameRequired')
    }

    const data = {
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Signup Error:', error)
        redirect('/auth/error?message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth/login')
}

export async function updateProfile(formData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName')

    // Validate Triple Name
    const nameParts = fullName ? fullName.trim().split(/\s+/) : []
    if (nameParts.length < 3) {
        return { error: 'TripleNameRequired' }
    }

    // 1. Update public profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (profileError) {
        return { error: profileError.message }
    }

    // 2. Update Auth Metadata (so session has new name)
    const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
    })

    if (authError) {
        return { error: authError.message }
    }

    revalidatePath('/profile')
    revalidatePath('/', 'layout') // Update Navbar
    return { success: true }
}
