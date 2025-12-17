import styles from "./StatsCard.module.css";

export default function StatsCard({ icon: Icon, label, value }) {
    return (
        <div className={styles.card}>
            {Icon && (
                <div className={styles.iconWrapper}>
                    <Icon size={24} />
                </div>
            )}
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>
            </div>
        </div>
    );
}
