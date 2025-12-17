"use client";

import styles from "./Footer.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>
                    {t.common.footer}
                </p>
            </div>
        </footer>
    );
}
