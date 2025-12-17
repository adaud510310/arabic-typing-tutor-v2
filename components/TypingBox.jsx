"use client";

import { useEffect, useRef } from 'react';
import styles from './TypingBox.module.css';
import useTypingEngine from '@/hooks/useTypingEngine';
import { useLanguage } from '@/context/LanguageContext';

export default function TypingBox({ text, onComplete, onProgress }) {
    const { typedText, wpm, accuracy, status, handleKeyDown, reset } = useTypingEngine(text);
    const { dir } = useLanguage();
    const containerRef = useRef(null);
    const audioCtxRef = useRef(null);

    const playSound = (isError = false) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            const oscillator = audioCtxRef.current.createOscillator();
            const gainNode = audioCtxRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtxRef.current.destination);

            if (isError) {
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, audioCtxRef.current.currentTime);
                oscillator.frequency.linearRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
            } else {
                // Mechanical click
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.08);
                gainNode.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
            }

            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);

            oscillator.start();
            oscillator.stop(audioCtxRef.current.currentTime + 0.08);
        } catch (e) {
            console.error(e);
        }
    };

    const handleInput = (e) => {
        // Simple heuristic: if key is printable, play sound. 
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
            // Ideally we check correctness here, but strict correctness needs hook logic exposing. 
            // We will play distinct click.

            // Check if incorrect (simple prediction)
            const nextChar = text[typedText.length];
            const isWrong = e.key.length === 1 && nextChar && e.key !== nextChar;
            playSound(isWrong);
        }
        handleKeyDown(e);
    };

    useEffect(() => {
        if (status === 'finished' && onComplete) {
            onComplete({ wpm, accuracy });
        }
    }, [status, wpm, accuracy, onComplete]);

    useEffect(() => {
        if (onProgress && status !== 'finished') {
            const nextChar = text[typedText.length];
            onProgress(nextChar);
        }
    }, [typedText, text, onProgress, status]);

    // Focus container on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    const renderReferenceText = () => {
        return text.split('').map((char, index) => {
            let className = styles.char;
            if (index < typedText.length) {
                className += typedText[index] === char ? ` ${styles.correct}` : ` ${styles.incorrect}`;
            } else if (index === typedText.length) {
                className += ` ${styles.current}`;
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>WPM</span>
                    <span className={styles.statValue}>{wpm}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Accuracy</span>
                    <span className={styles.statValue}>{accuracy}%</span>
                </div>
            </div>

            <div
                className={styles.wrapper}
                tabIndex={0}
                onKeyDown={handleInput}
                ref={containerRef}
            >
                {/* Reference Box (Top) */}
                <div
                    className={`${styles.referenceBox} ${text.length > 500 ? styles.smallFont : ''}`}
                    style={{ direction: dir }}
                >
                    {renderReferenceText()}
                </div>

                {/* Input Box (Bottom) */}
                <div
                    className={`${styles.inputBox} ${text.length > 500 ? styles.smallFont : ''}`}
                    style={{ direction: dir }}
                >
                    {typedText}
                    <span className={styles.inputCursor}></span>
                </div>
            </div>

            {status === 'finished' && (
                <div className="mt-4 flex justify-center">
                    <button onClick={reset} className="btn btn-primary">
                        إعادة المحاولة
                    </button>
                </div>
            )}
        </div>
    );
}
