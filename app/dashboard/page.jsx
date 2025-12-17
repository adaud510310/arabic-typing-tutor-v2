import { createClient } from '@/utils/supabase/server'
import styles from "./page.module.css";
import StatsCard from "@/components/StatsCard";
import { Trophy, Target, BookOpen, Activity } from "lucide-react";
import DashboardChart from './DashboardChart'; // New Client Component

export const dynamic = 'force-dynamic'

async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    return progress || []
}

export default async function DashboardPage() {
    const progress = await getDashboardData() || [];

    // Calculate Stats
    const bestSpeed = progress.length > 0 ? Math.max(...progress.map(p => p.wpm)) : 0;
    const bestAccuracy = progress.length > 0 ? Math.max(...progress.map(p => p.accuracy)) : 0;
    const completedLessons = new Set(progress.map(p => p.lesson_id)).size;
    const lastTestSpeed = progress.length > 0 ? progress[progress.length - 1].wpm : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>لوحة التحكم</h1>
                <p className={styles.subtitle}>مرحباً بك، تابع تقدمك وإحصائياتك</p>
            </div>

            <div className={styles.statsGrid}>
                <StatsCard
                    icon={Trophy}
                    label="أفضل سرعة"
                    value={`${bestSpeed} WPM`}
                />
                <StatsCard
                    icon={Target}
                    label="أعلى دقة"
                    value={`${bestAccuracy}%`}
                />
                <StatsCard
                    icon={BookOpen}
                    label="الدروس المنجزة"
                    value={completedLessons}
                />
                <StatsCard
                    icon={Activity}
                    label="آخر اختبار"
                    value={`${lastTestSpeed} WPM`}
                />
            </div>

            <div className={styles.chartSection}>
                <h2 className={styles.chartTitle}>تطور المستوى</h2>
                <div className={styles.chartWrapper}>
                    <DashboardChart data={progress} />
                </div>
            </div>
        </div>
    );
}
