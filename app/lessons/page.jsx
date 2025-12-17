"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import TypingBox from '@/components/TypingBox';
import Keyboard from '@/components/Keyboard';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LESSONS_AR = [
    {
        id: 1,
        title: "وضع اليدين",
        description: "تعلم الوضعية الصحيحة لليدين على لوحة المفاتيح.",
        exercises: [
            { title: "التمرين الأول", content: "ب ت ن ي ب ت ن ي ب ب ت ت ن ن ي ي بتني يتنب ب ت ن ي" },
            { title: "التمرين الثاني", content: "يب نت يت بن ني تب بت ن ي" }
        ]
    },
    {
        id: 2,
        title: "صف الارتكاز",
        description: "التدرب على حروف صف الارتكاز (ش س ي ب ل ا ت ن م ك).",
        exercises: [
            { title: "الجهة اليمنى", content: "ت ن م ك ت ن م ك تنمك تنمك" },
            { title: "الجهة اليسرى", content: "ش س ي ب ش س ي ب شسيب شسيب" },
            { title: "الكل", content: "ش س ي ب ل ا ت ن م ك شسيب لاتنمك ش س ي ب ل ا ت ن م ك" },
            { title: "كلمات متشابكة (كل الصف)", content: "شسيب لاتنمك شسيب لاتنمك كتب بيب سيل شتن مكي نمب" }
        ]
    },
    {
        id: 3,
        title: "الصف العلوي",
        description: "تدريبات مفصلة على حروف الصف العلوي.",
        exercises: [
            { title: "العين والقاف - حروف متفرقة", content: "ع ع ع ق ق ق ع ع ع ق ق ق ع ع ق ق ع ق ع ق" },
            { title: "العين والقاف - حروف متشابكة", content: "عق عق عق عق عقعق عقعق" },
            { title: "الهاء والثاء - حروف متفرقة", content: "ه ه ه ث ث ث ه ه ه ث ث ث ه ه ث ث ه ث ه ث" },
            { title: "الهاء والثاء - حروف متشابكة", content: "هث هث هث هث هثهث هثهث" },
            { title: "الخاء والصاد - حروف متفرقة", content: "خ خ خ ص ص ص خ خ خ ص ص ص خ خ ص ص خ ص خ ص" },
            { title: "الخاء والصاد - حروف متشابكة", content: "خص خص خص خص خصخص خصخص" },
            { title: "الحاء والضاد - حروف متفرقة", content: "ح ح ح ض ض ض ح ح ح ض ض ض ح ح ض ض ح ض ح ض" },
            { title: "الحاء والضاد - حروف متشابكة", content: "حض حض حض حض حضحض حضحض" },
            { title: "الجيم والدال والذال - حروف متفرقة", content: "ج ج ج د د د ذ ذ ذ ج ج د د ذ ذ ج د ذ ج د ذ" },
            { title: "الجيم والدال والذال - حروف متشابكة", content: "جد جد ذج ذج جدذ جدذ" },
            { title: "الغين والفاء - حروف متفرقة", content: "غ غ غ ف ف ف إ إ إ غ غ ف ف إ إ غ ف إ غ ف إ" },
            { title: "الغين والفاء - حروف متشابكة", content: "غف غف فإ فإ غفإ غفإ" },
            { title: "كلمات متشابكة (كل الصف)", content: "عقث صضذ فإغ هخص حجد ذغف ثصه ضجذ عقث صضذ فإغ" }
        ]
    },
    {
        id: 4,
        title: "الصف السفلي",
        description: "تدريبات مفصلة على حروف الصف السفلي.",
        exercises: [
            { title: "التاء المربوطة والراء - حروف متفرقة", content: "ة ة ة ر ر ر ة ة ة ر ر ر ة ة ر ر ة ر ة ر" },
            { title: "التاء المربوطة والراء - حروف متشابكة", content: "ةر ةر ةر ةر ةرةر ةرةر" },
            { title: "الواو والهمزة - حروف متفرقة", content: "و و و ؤ ؤ ؤ و و و ؤ ؤ ؤ و و ؤ ؤ و ؤ و ؤ" },
            { title: "الواو والهمزة - حروف متشابكة", content: "وؤ وؤ وؤ وؤ وؤوؤ وؤوؤ" },
            { title: "الزين والهمزة - حروف متفرقة", content: "ز ز ز ء ء ء ز ز ز ء ء ء ز ز ء ء ز ء ز ء" },
            { title: "الزين والهمزة - حروف متشابكة", content: "زء زء زء زء زءزء زءزء" },
            { title: "الظاء والهمزة - حروف متفرقة", content: "ظ ظ ظ ئ ئ ئ ظ ظ ظ ئ ئ ئ ظ ظ ئ ئ ظ ئ ظ ئ" },
            { title: "الظاء والهمزة - حروف متشابكة", content: "ظئ ظئ ظئ ظئ ظئظئ ظئظئ" },
            { title: "الألف المقصورة والمد - حروف متفرقة", content: "ى ى ى آ آ آ ى ى ى آ آ آ ى ى آ آ ى آ ى آ" },
            { title: "الألف المقصورة والمد - حروف متشابكة", content: "ىآ ىآ ىآ ىآ ىآىآ ىآىآ" },
            { title: "الرموز - متفرقة", content: ". . . ؟ ؟ ؟ . . . ؟ ؟ ؟ . ؟ . ؟" },
            { title: "الرموز - متشابكة", content: ".؟ .؟ .؟ .؟ ... ؟؟؟" },
            { title: "كلمات متشابكة (كل الصف)", content: "ةرؤ زءئ ظىآ .؟ ةرؤ زءئ ظىآ .؟ ةرؤ زءئ" }
        ]
    },
    {
        id: 5,
        title: "الحروف الأساسية",
        description: "دمج الحروف الأساسية لتكوين كلمات بسيطة.",
        exercises: [
            { title: "كلمات 1", content: "بنت بيت تين نيب يبت تبن نيت بيب بنت بيت تين نيب" }
        ]
    },
    {
        id: 6,
        title: "الكلمات",
        description: "كتابة كلمات وجمل قصيرة.",
        exercises: [
            { title: "جمل قصيرة", content: "ذهب الولد الى المدرسة رجع الاب من العمل كتب الطالب الدرس" }
        ]
    },
    {
        id: 7,
        title: "الفقرات الطويلة",
        description: "التدرب على كتابة فقرات كاملة ومتصلة.",
        exercises: [
            { title: "الفقرة", content: "القراءة غذاء الروح والعقل، وهي مفتاح المعرفة. الكتب هي ثروة العالم المخزونة وأفضل إرث للأجيال." }
        ]
    }
];

const LESSONS_EN = [
    {
        id: 1,
        title: "Home Row",
        description: "Learn the correct finger placement on the home row.",
        exercises: [
            { title: "Drill 1", content: "asdf jkl; asdf jkl;" }
        ]
    },
    {
        id: 2,
        title: "Top Row",
        description: "Practice the top row keys (q w e r t y u i o p).",
        exercises: [
            { title: "Drill 1", content: "qwert yuiop qwert yuiop" }
        ]
    },
    {
        id: 3,
        title: "Bottom Row",
        description: "Practice the bottom row keys (z x c v b n m , . /).",
        exercises: [
            { title: "Drill 1", content: "zxcvb nm,./ zxcvb nm,./" }
        ]
    },
    {
        id: 4,
        title: "Basic Words",
        description: "Type simple words using common letters.",
        exercises: [
            { title: "Drill 1", content: "the quick brown fox jumps" }
        ]
    },
    {
        id: 5,
        title: "Paragraphs",
        description: "Practice typing full connected paragraphs.",
        exercises: [
            { title: "Drill 1", content: "Reading is food for the soul and mind, and it is the key to knowledge." }
        ]
    }
];

function LessonsContent() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Derive active lesson from URL
    const lessonId = searchParams.get('id');
    const lessons = lang === 'ar' ? LESSONS_AR : LESSONS_EN;
    const activeLesson = lessonId ? lessons.find(l => l.id === parseInt(lessonId)) : null;

    const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
    const [results, setResults] = useState(null);
    const [activeChar, setActiveChar] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);

    const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

    useEffect(() => {
        const saved = localStorage.getItem('completedLessons');
        if (saved) {
            setCompletedLessons(JSON.parse(saved));
        }
    }, []);

    // Reset state when activeLesson changes
    useEffect(() => {
        setActiveExerciseIndex(0);
        setResults(null);
        if (activeLesson) {
            setActiveChar(activeLesson.exercises[0].content[0]);
        } else {
            setActiveChar(null);
        }
    }, [activeLesson?.id]); // Reset when ID changes

    const handleStartLesson = (lesson) => {
        router.push(`/lessons?id=${lesson.id}`);
    };

    const handleComplete = (stats) => {
        setResults(stats);
        setActiveChar(null);

        // Mark as complete if it's the last exercise
        if (activeLesson && activeExerciseIndex === activeLesson.exercises.length - 1) {
            const newCompleted = [...new Set([...completedLessons, activeLesson.id])];
            setCompletedLessons(newCompleted);
            localStorage.setItem('completedLessons', JSON.stringify(newCompleted));

            // Save to Supabase
            import('@/app/actions/progress').then(({ saveProgress }) => {
                saveProgress(activeLesson.id, stats.wpm, stats.accuracy);
            });
        }
    };

    const handleBack = () => {
        router.push('/lessons');
    };

    const handleNextExercise = () => {
        const nextIndex = activeExerciseIndex + 1;
        if (activeLesson && nextIndex < activeLesson.exercises.length) {
            setActiveExerciseIndex(nextIndex);
            setResults(null);
            setActiveChar(activeLesson.exercises[nextIndex].content[0]);
        } else {
            handleBack();
        }
    };

    // Callback to update active char from TypingBox (needs update in TypingBox)
    const handleTypingProgress = (char) => {
        setActiveChar(char);
    };

    const currentExercise = activeLesson ? activeLesson.exercises[activeExerciseIndex] : null;

    if (activeLesson && currentExercise) {
        return (
            <div className={styles.container}>
                <button onClick={handleBack} className={styles.backButton}>
                    <ArrowIcon size={20} />
                    {t.lessons.backToLessons}
                </button>

                <div className={styles.activeLesson}>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <span className="text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                {currentExercise.title}
                            </span>
                            <span className="text-gray-400 text-sm">
                                ({activeExerciseIndex + 1} / {activeLesson.exercises.length})
                            </span>
                        </div>
                        <p className="text-gray-400">{activeLesson.description}</p>
                    </div>

                    {!results ? (
                        <>
                            <TypingBox
                                text={currentExercise.content}
                                onComplete={handleComplete}
                                onProgress={handleTypingProgress}
                            />
                            <Keyboard activeChar={activeChar} />
                        </>
                    ) : (
                        <div className={styles.results}>
                            <div className="flex justify-center mb-6 text-green-500">
                                <CheckCircle size={64} />
                            </div>
                            <h2 className={styles.resultsTitle}>
                                {activeExerciseIndex < activeLesson.exercises.length - 1
                                    ? "أحسنت! أكمل التمرين التالي"
                                    : t.lessons.completedTitle}
                            </h2>

                            <div className={styles.statsGrid}>
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-1">{t.lessons.speed}</div>
                                    <div className="text-4xl font-bold text-indigo-500">{results.wpm} <span className="text-lg">WPM</span></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-1">{t.lessons.accuracy}</div>
                                    <div className="text-4xl font-bold text-indigo-500">{results.accuracy}%</div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button onClick={handleBack} className="btn btn-secondary">
                                    {t.lessons.lessonList}
                                </button>
                                <button onClick={() => { setResults(null); setActiveChar(currentExercise.content[0]); }} className="btn btn-secondary">
                                    {t.lessons.retryLesson}
                                </button>
                                {activeExerciseIndex < activeLesson.exercises.length - 1 && (
                                    <button onClick={handleNextExercise} className="btn btn-primary">
                                        التالي
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.lessons.title}</h1>
                <p className={styles.subtitle}>{t.lessons.subtitle}</p>
            </div>

            <div className={styles.grid}>
                {lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                        <div key={lesson.id} className={styles.lessonCard} onClick={() => handleStartLesson(lesson)}>
                            <div className={styles.lessonHeader}>
                                <span className={styles.lessonNumber}>{t.lessons.lesson} {lesson.id}</span>
                                {isCompleted && <CheckCircle className="text-emerald-500" size={24} />}
                            </div>
                            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                            <p className={styles.lessonDesc}>{lesson.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function LessonsPage() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading...</div>}>
            <LessonsContent />
        </Suspense>
    );
}
