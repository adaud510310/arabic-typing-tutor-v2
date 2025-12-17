"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { Globe, Moon, Sun, LayoutDashboard, LogOut, User as UserIcon, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from 'react';
import { signout } from '@/app/auth/actions';

export default function Navbar({ user }) {
    const { t, lang, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Logo" width={160} height={55} className="object-contain" priority />
                </Link>

                <div className={styles.navLinks}>
                    <Link href="/lessons" className={styles.link}>
                        <span className="flex items-center gap-2">
                            {t.common.lessons}
                        </span>
                    </Link>
                    <Link href="/test" className={styles.link}>
                        {t.common.test}
                    </Link>
                    <Link href="/dashboard" className={styles.link}>
                        {t.common.dashboard}
                    </Link>
                </div>

                <div className={styles.actions}>
                    <button onClick={toggleTheme} className={styles.iconButton} title="Toggle Theme">
                        {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={toggleLanguage} className={styles.iconButton} title="Switch Language">
                        <Globe size={20} />
                    </button>

                    {user ? (
                        <div className={styles.userSection}>
                            {/* Admin Badge */}
                            {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                <Link href="/admin" className={styles.adminBadge} title={mounted && lang === 'ar' ? 'لوحة المدير' : 'Admin Dashboard'}>
                                    <ShieldAlert size={18} />
                                </Link>
                            )}

                            {/* User Icon */}
                            <Link href="/profile" className={styles.iconButton} title={user.email}>
                                <UserIcon size={20} />
                            </Link>

                            {/* Logout */}
                            <form action={signout}>
                                <button type="submit" className={`${styles.iconButton} ${styles.logoutBtn}`} title={mounted && lang === 'ar' ? 'خروج' : 'Logout'}>
                                    <LogOut size={20} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="btn btn-primary">
                            {mounted && lang === 'ar' ? 'دخول' : 'Login'}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
