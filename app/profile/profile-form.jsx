'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { updateProfile } from '@/app/auth/actions'
import styles from './ProfilePage.module.css'
import { User, Mail, Save, CheckCircle, AlertCircle, Clock, BookOpen, Activity } from 'lucide-react'

export default function ProfilePage({ user, profile, stats }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null)
                setIsSaved(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message])

    async function handleSubmit(formData) {
        setIsLoading(true)
        setMessage(null)
        setIsSaved(false)

        const result = await updateProfile(formData)

        if (result.error) {
            setMessage({ type: 'error', text: result.error === 'TripleNameRequired' ? 'الاسم الثلاثي مطلوب!' : result.error })
        } else {
            setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح!' })
            setIsSaved(true)
        }
        setIsLoading(false)
    }

    // Get initials
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')
        : user?.email[0].toUpperCase()

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        {initials}
                    </div>
                    <h1 className={styles.title}>إعدادات الملف الشخصي</h1>
                    <p className={styles.email}>{user?.email}</p>
                </div>

                <form action={handleSubmit} className={styles.form}>
                    {message && (
                        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الاسم الكامل</label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={profile?.full_name || ''}
                                className={styles.input}
                                placeholder="الاسم الثلاثي"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 mr-1">يرجى كتابة الاسم الثلاثي كما يظهر في الهوية.</p>
                    </div>

                    <button type="submit" className={`${styles.submitButton} ${isSaved ? 'bg-green-600' : ''}`} disabled={isLoading}>
                        {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {isLoading ? 'جاري الحفظ...' : (isSaved ? 'تم الحفظ' : 'حفظ التغييرات')}
                    </button>
                </form>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className="flex justify-center mb-2 text-emerald-600">
                            <BookOpen size={24} />
                        </div>
                        <span className={styles.statValue}>{stats.completedLessons}</span>
                        <span className={styles.statLabel}>دروس مكتملة</span>
                    </div>
                    <div className={styles.statItem}>
                        <div className="flex justify-center mb-2 text-emerald-600">
                            <Activity size={24} />
                        </div>
                        <span className={styles.statValue}>{stats.avgSpeed} WPM</span>
                        <span className={styles.statLabel}>متوسط السرعة</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
