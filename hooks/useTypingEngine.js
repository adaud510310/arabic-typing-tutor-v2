import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Mapping from English QWERTY to Arabic (without Shift)
const KEY_MAP_EN_TO_AR = {
    'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'د',
    'a': 'ش', 's': 'س', 'd': 'ي', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ك', '\'': 'ط',
    'z': 'ئ', 'x': 'ء', 'c': 'ؤ', 'v': 'ر', 'b': 'ل', 'n': 'ى', 'm': 'ة', ',': 'و', '.': 'ز', '/': 'ظ', '`': 'ذ'
};

// Mapping from English QWERTY to Arabic (with Shift)
const KEY_MAP_EN_TO_AR_SHIFT = {
    '`': 'ّ',  // Shadda
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': ')',
    '0': '(',
    '-': '_',
    '=': '+',
    'q': 'َ',  // Fatha
    'w': 'ّ',  // Shadda
    'e': 'ُ',  // Damma
    'r': 'ً',  // Tanween Fath
    't': 'ٌ',  // Tanween Damm
    'y': 'إ',  // Hamza below Alif
    'u': '\u2018',  // Left single quotation
    'i': '÷',  // Division
    'o': '×',  // Multiplication
    'p': '؛',  // Arabic semicolon
    '[': '<',
    ']': '>',
    'a': 'ِ',  // Kasra
    's': 'ٍ',  // Tanween Kasr
    'd': '[',
    'f': ']',
    'g': 'لأ', // Lam-Alif with Hamza above
    'h': 'أ',  // Hamza above Alif
    'j': 'ـ',  // Tatweel
    'k': '،',  // Arabic comma
    'l': '/',
    ';': ':',
    '\'': '"',
    'z': '~',
    'x': 'ْ',  // Sukun
    'c': '}',
    'v': '{',
    'b': 'لإ', // Lam-Alif with Hamza below
    'n': 'آ',  // Alif with Maddah
    'm': '\u2019',  // Right single quotation
    ',': ',',
    '.': '.',  // Period
    '/': '؟'   // Arabic question mark
};


export default function useTypingEngine(targetText) {
    const [typedText, setTypedText] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [status, setStatus] = useState('idle'); // idle, typing, finished
    const { lang } = useLanguage();

    const calculateStats = useCallback(() => {
        if (!startTime) return;

        const now = endTime || Date.now();
        const timeInMinutes = (now - startTime) / 60000;

        if (timeInMinutes <= 0) return;

        // WPM calculation: (All typed characters / 5) / time in minutes
        const grossWpm = (typedText.length / 5) / timeInMinutes;
        setWpm(Math.round(grossWpm));

        // Accuracy calculation
        let errors = 0;
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] !== targetText[i]) {
                errors++;
            }
        }
        const accuracyVal = Math.max(0, ((typedText.length - errors) / typedText.length) * 100);
        setAccuracy(Math.round(accuracyVal));
    }, [typedText, startTime, endTime, targetText]);

    useEffect(() => {
        if (status === 'typing') {
            const interval = setInterval(calculateStats, 1000);
            return () => clearInterval(interval);
        }
    }, [status, calculateStats]);

    const reset = useCallback(() => {
        setTypedText('');
        setStartTime(null);
        setEndTime(null);
        setWpm(0);
        setAccuracy(100);
        setStatus('idle');
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (status === 'finished') return;

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault(); // Prevent scrolling for Space

            if (status === 'idle') {
                setStatus('typing');
                setStartTime(Date.now());
            }

            let charToAdd = e.key;

            // If language is Arabic, try to map English keys to Arabic
            if (lang === 'ar') {
                const keyLower = e.key.toLowerCase();

                // Check if Shift is pressed
                if (e.shiftKey) {
                    // Use Shift mapping
                    if (KEY_MAP_EN_TO_AR_SHIFT[keyLower]) {
                        charToAdd = KEY_MAP_EN_TO_AR_SHIFT[keyLower];
                    }
                } else {
                    // Use normal mapping
                    if (KEY_MAP_EN_TO_AR[keyLower]) {
                        charToAdd = KEY_MAP_EN_TO_AR[keyLower];
                    }
                }
            }

            setTypedText((prev) => {
                const next = prev + charToAdd;
                if (next.length === targetText.length) {
                    setStatus('finished');
                    setEndTime(Date.now());
                }
                return next;
            });
        } else if (e.key === 'Backspace') {
            setTypedText((prev) => prev.slice(0, -1));
        }
    }, [status, targetText, lang]);

    return {
        typedText,
        wpm,
        accuracy,
        status,
        reset,
        handleKeyDown
    };
}
