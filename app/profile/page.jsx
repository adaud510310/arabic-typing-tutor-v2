import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Stats
    const { data: progress } = await supabase
        .from('user_progress')
        .select('wpm')
        .eq('user_id', user.id)

    const completedLessons = progress ? progress.length : 0
    const avgSpeed = progress && progress.length > 0
        ? Math.round(progress.reduce((acc, curr) => acc + curr.wpm, 0) / progress.length)
        : 0

    return <ProfileForm user={user} profile={profile} stats={{ completedLessons, avgSpeed }} />
}
