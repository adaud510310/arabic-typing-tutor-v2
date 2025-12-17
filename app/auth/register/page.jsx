"use client";

import Link from "next/link";
import styles from "./RegisterPage.module.css";
import { signup } from "../actions";
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            {/* Logo Section */}
            <div className={styles.logoWrapper}>
                <Image src="/logo.png" alt="Logo" width={200} height={70} className="object-contain" priority />
            </div>

            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            <UserPlus size={40} />
                        </div>
                        <h1 className={styles.title}>إنشاء حساب جديد</h1>
                        <p className={styles.subtitle}>انضم إلينا لتبدأ رحلة التعلم</p>
                    </div>

                    <form className={styles.form} action={signup}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>الاسم الكامل</label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputIcon}>
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    className={styles.input}
                                    placeholder="الاسم الكامل"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>البريد الإلكتروني</label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputIcon}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className={styles.input}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>كلمة المرور</label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputIcon}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.registerButton}>
                            إنشاء حساب
                        </button>
                    </form>

                    <div className={styles.footer}>
                        لديك حساب بالفعل؟
                        <Link href="/auth/login" className={styles.link}>
                            تسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
