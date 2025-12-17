import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import styles from './AdminDashboard.module.css'
import Image from 'next/image'
import { User, Activity, BookOpen, Clock, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getAdminData() {
    const supabase = await createClient()

    // 1. Fetch all progress
    const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .order('created_at', { ascending: false })

    if (progressError) {
        console.error('Error fetching progress:', JSON.stringify(progressError, null, 2))
    }

    // 2. Fetch all profiles
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    // Filter out the admin from the profiles list
    const filteredProfiles = profilesData
        ? profilesData.filter(p => p.email !== adminEmail)
        : []

    const errors = []
    if (progressError) errors.push(`Progress Error: ${progressError.message} (${progressError.code})`)
    if (profilesError) errors.push(`Profiles Error: ${profilesError.message} (${profilesError.code})`)

    return {
        progress: progressData || [],
        profiles: filteredProfiles,
        error: errors.length > 0 ? errors.join(' | ') : null
    }
}

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        redirect('/')
    }

    const { progress, profiles, error } = await getAdminData()

    // Helper to get user details
    const getUserDetails = (userId) => {
        const profile = profiles.find(p => p.id === userId)
        return {
            name: profile?.full_name || 'مستخدم غير معروف',
            email: profile?.email || 'N/A'
        }
    }

    // Calculate Stats
    const totalUsers = profiles.length
    const totalLessons = progress.length
    const activeStudents = new Set(progress.map(p => p.user_id)).size
    const avgSpeed = totalLessons > 0
        ? Math.round(progress.reduce((acc, curr) => acc + curr.wpm, 0) / totalLessons)
        : 0

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>لوحة تحكم المدير</h1>
                <p className={styles.subtitle}>نظرة عامة على أداء ومستويات الطلاب</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.statCard}>
                    <div className="flex items-center gap-2">
                        <Users className="text-blue-500" size={20} />
                        <span className={styles.statLabel}>إجمالي الطلاب المسجلين</span>
                    </div>
                    <span className={styles.statValue}>{totalUsers}</span>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center gap-2">
                        <User className="text-indigo-500" size={20} />
                        <span className={styles.statLabel}>الطلاب النشطين (بدأوا التدريب)</span>
                    </div>
                    <span className={styles.statValue}>{activeStudents}</span>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-green-500" size={20} />
                        <span className={styles.statLabel}>تمرينات مكتملة</span>
                    </div>
                    <span className={styles.statValue}>{totalLessons}</span>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center gap-2">
                        <Activity className="text-purple-500" size={20} />
                        <span className={styles.statLabel}>متوسط السرعة (الكل)</span>
                    </div>
                    <span className={styles.statValue}>{avgSpeed} <span className="text-lg font-normal text-gray-400">WPM</span></span>
                </div>
            </div>

            <div className="mb-10">
                <h2 className={styles.sectionTitle}>دليل الطلاب المسجلين</h2>
                <div className={styles.tableWrapper}>
                    {profiles.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>تاريخ التسجيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id}>
                                        <td className="font-bold">{profile.full_name || '---'}</td>
                                        <td className="text-gray-600 font-mono text-sm">{profile.email}</td>
                                        <td className="text-gray-500 text-sm">
                                            {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('ar-EG') : '---'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyState}>
                            لا يوجد طلاب مسجلين في الجدول. (قد تحتاج لتشغيل كود التحديث)
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className={styles.sectionTitle}>سجل النشاطات الأخيرة</h2>
                <div className={styles.tableWrapper}>
                    {progress.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>الطالب</th>
                                    <th>التمرين</th>
                                    <th>السرعة (WPM)</th>
                                    <th>الدقة</th>
                                    <th>التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progress.map((item) => {
                                    const { name, email } = getUserDetails(item.user_id)
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div className={styles.userCell}>
                                                    <span className={styles.userName}>{name}</span>
                                                    <span className={styles.userEmail}>{email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.badge}>درس {item.lesson_id}</span>
                                            </td>
                                            <td className="font-bold text-indigo-600">{item.wpm}</td>
                                            <td className="text-green-600">{item.accuracy}%</td>
                                            <td className="text-gray-500 text-sm">
                                                {new Date(item.created_at).toLocaleDateString('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyState}>
                            لم يتم تسجيل أي نشاط حتى الآن.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
