"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { Keyboard, Zap, BarChart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {t.home.heroTitle.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className={styles.subtitle}>
            {t.home.heroSubtitle}
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/lessons" className="btn btn-primary">
              {t.home.startLearning}
            </Link>
            <Link href="/test" className="btn btn-secondary">
              {t.home.testSpeed}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Keyboard size={40} />
          </div>
          <h3 className={styles.featureTitle}>{t.home.feature1Title}</h3>
          <p className={styles.featureDesc}>
            {t.home.feature1Desc}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Zap size={40} />
          </div>
          <h3 className={styles.featureTitle}>{t.home.feature2Title}</h3>
          <p className={styles.featureDesc}>
            {t.home.feature2Desc}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <BarChart size={40} />
          </div>
          <h3 className={styles.featureTitle}>{t.home.feature3Title}</h3>
          <p className={styles.featureDesc}>
            {t.home.feature3Desc}
          </p>
        </div>
      </section>
    </div>
  );
}
