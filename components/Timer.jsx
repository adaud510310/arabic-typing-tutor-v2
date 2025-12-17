"use client";

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import styles from './Timer.module.css';

export default function Timer({ duration, onFinish, isRunning }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onFinish?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onFinish]);

    const getClassName = () => {
        let className = styles.timer;
        if (timeLeft <= 5) className += ` ${styles.danger}`;
        else if (timeLeft <= 10) className += ` ${styles.warning}`;
        return className;
    };

    return (
        <div className={getClassName()}>
            <Clock size={24} />
            <span>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
        </div>
    );
}
