import { login, signup } from '../actions'
import { Mail, Lock, UserCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './LoginPage.module.css'

export default function LoginPage() {
    return (
        <div className={styles.container}>

            {/* Logo Section */}
            <div className={styles.logoWrapper}>
                <Image src="/logo.png" alt="Logo" width={200} height={70} className="object-contain" priority />
            </div>

            {/* Login Card */}
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            <UserCircle size={40} />
                        </div>
                        <h1 className={styles.title}>تسجيل الدخول</h1>
                        <p className={styles.subtitle}>أدخل بياناتك للمتابعة إلى المنصة</p>
                    </div>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                البريد الإلكتروني
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputIcon}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                كلمة المرور
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputIcon}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                formAction={login}
                                className={styles.loginButton}
                            >
                                تسجيل الدخول
                            </button>

                            <div className={styles.separator}>
                                <span className={styles.separatorText}>أو</span>
                            </div>

                            <div className={styles.footer}>
                                لا تمتلك حساباً؟
                                <Link href="/auth/register" className={styles.link}>
                                    إنشاء حساب جديد
                                </Link>
                            </div>
                        </div>
                    </form>
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
