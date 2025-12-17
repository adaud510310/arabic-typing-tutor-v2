"use client";

import styles from "./Keyboard.module.css";
import { useLanguage } from "@/context/LanguageContext";

const ROWS_EN = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Space"]
];

const ROWS_AR = [
    ["ذ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د", "\\"],
    ["Caps", "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "Enter"],
    ["Shift", "ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "Shift"],
    ["Space"]
];

// Mapping for highlighting
const KEY_MAP_AR_TO_EN = {
    'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't', 'غ': 'y', 'ع': 'u', 'ه': 'i', 'خ': 'o', 'ح': 'p', 'ج': '[', 'د': ']',
    'ش': 'a', 'س': 's', 'ي': 'd', 'ب': 'f', 'ل': 'g', 'ا': 'h', 'ت': 'j', 'ن': 'k', 'م': 'l', 'ك': ';', 'ط': '\'',
    'ئ': 'z', 'ء': 'x', 'ؤ': 'c', 'ر': 'v', 'لا': 'b', 'ى': 'n', 'ة': 'm', 'و': ',', 'ز': '.', 'ظ': '/', 'ذ': '`'
};

export default function Keyboard({ activeChar }) {
    const { lang } = useLanguage();
    const isArabic = lang === 'ar';
    const rows = isArabic ? ROWS_AR : ROWS_EN;

    const getKeyClass = (key, rowIndex, keyIndex) => {
        // Determine the "code" or English equivalent for matching
        let checkKey = key;
        if (isArabic) {
            // Find the English key at the same position
            checkKey = ROWS_EN[rowIndex][keyIndex];
        }

        let className = styles.key;
        if (key === "Space") className += ` ${styles.space}`;
        if (key === "Shift") className += ` ${styles.shift}`;
        if (key === "Enter") className += ` ${styles.enter}`;
        if (key === "Backspace") className += ` ${styles.backspace}`;
        if (key === "Tab") className += ` ${styles.tab}`;
        if (key === "Caps") className += ` ${styles.caps}`;

        // Active check
        let isActive = false;
        if (activeChar === " " && key === "Space") isActive = true;
        else if (activeChar) {
            // Normalize activeChar
            const normalizedActive = activeChar.toLowerCase();
            const normalizedKey = checkKey.toLowerCase();

            if (normalizedActive === normalizedKey) isActive = true;

            // Also check if activeChar is Arabic and matches the key directly
            if (activeChar === key) isActive = true;

            // Check mapping if activeChar is Arabic but we are checking against English key code (or vice versa)
            if (KEY_MAP_AR_TO_EN[activeChar] === normalizedKey) isActive = true;
        }

        if (isActive) className += ` ${styles.active}`;
        return className;
    };

    return (
        <div className={styles.keyboard} dir="ltr"> {/* Keyboard layout is physically LTR usually */}
            {rows.map((row, i) => (
                <div key={i} className={styles.row}>
                    {row.map((key, j) => (
                        <div key={`${i}-${j}`} className={getKeyClass(key, i, j)}>
                            {key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
