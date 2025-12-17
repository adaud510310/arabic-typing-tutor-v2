"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { AlertCircle, ArrowRight } from 'lucide-react'
import styles from './ErrorPage.module.css'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('message')

    // Translate common errors
    let displayError = error
    let title = "حدث خطأ ما"
    let description = "عذراً، لم نتمكن من إتمام العملية."

    if (error === "User already registered") {
        title = "الحساب مسجل مسبقاً"
        description = "يبدو أن هذا البريد الإلكتروني مسجل بالفعل لدينا. حاول تسجيل الدخول بدلاً من ذلك."
    } else if (error === "TripleNameRequired") {
        title = "الاسم الثلاثي مطلوب"
        description = "يرجى كتابة الاسم الكامل (ثلاثي على الأقل) لضمان دقة الشهادة."
        displayError = null // Don't show technical error
    } else if (error === "TripleNameRequired") {
        title = "الاسم الثلاثي مطلوب"
        description = "يرجى كتابة الاسم الكامل (ثلاثي على الأقل) لضمان دقة الشهادة."
        displayError = null // Don't show technical error
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.iconWrapper}>
                        <AlertCircle size={48} />
                    </div>

                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.message}>{description}</p>

                    {displayError && displayError !== "User already registered" && (
                        <div className={styles.errorBox}>
                            {displayError}
                        </div>
                    )}

                    <Link href="/auth/login" className={styles.button}>
                        <span>العودة لصفحة الدخول</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className={styles.footer}>
                    <p className={styles.copyright}>
                        معهد المسارات التطبيقية العالي للتدريب © 2025
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function ErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
