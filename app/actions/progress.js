'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProgress(lessonId, wpm, accuracy) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('user_progress')
        .insert({
            user_id: user.id,
            lesson_id: lessonId.toString(),
            wpm: parseInt(wpm),
            accuracy: parseInt(accuracy)
        })

    if (error) {
        console.error('Error saving progress:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getProgress() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching progress:', error)
        return null
    }

    return data
}
