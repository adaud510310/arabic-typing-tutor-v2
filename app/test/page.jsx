"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import TypingBox from '@/components/TypingBox';
import Timer from '@/components/Timer';
import { RefreshCw, FileText, BookOpen, Scroll, Feather } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SHORT_TEXTS_AR = [
    "النجاح ليس مفتاح السعادة، بل السعادة هي مفتاح النجاح. إذا كنت تحب ما تفعله، فستكون ناجحاً.",
    "القراءة هي غذاء الروح، وهي النافذة التي نطل منها على العالم ونفهم بها الآخرين.",
    "العلم نور والجهل ظلام. اطلب العلم من المهد إلى اللحد ولا تتوقف عن التعلم أبداً."
];

const LONG_TEXTS_AR = [
    "تعتبر اللغة العربية من أقدم اللغات الحية على وجه الأرض، وهي لغة القرآن الكريم، ولغة الضاد التي تميزت بجمالها وبلاغتها. يتحدث بها مئات الملايين حول العالم، وتعتبر ركناً أساسياً من أركان التنوع الثقافي للبشرية. إن تعلم الطباعة السريعة باللغة العربية يفتح أمامك آفاقاً واسعة في سوق العمل، حيث تزداد الحاجة إلى المحتوى الرقمي العربي يوماً بعد يوم. تتطلب الطباعة السريعة ممارسة مستمرة وتركيزاً عالياً، حيث يجب عليك حفظ أماكن الحروف على لوحة المفاتيح واستخدام جميع أصابع اليدين. ابدأ بالتدريب على صف الارتكاز، ثم انتقل تدريجياً إلى باقي الصفوف. لا تهتم بالسرعة في البداية، بل ركز على الدقة، فالسرعة ستأتي تلقائياً مع الوقت والممارسة. إن إتقان هذه المهارة سيوفر عليك الكثير من الوقت والجهد في كتابة التقارير والمقالات والمراسلات، وسيجعلك أكثر إنتاجية في عملك ودراستك. استمر في التدريب ولا تيأس، فكل دقيقة تقضيها في التعلم هي استثمار في مستقبلك المهني والشخصي.",
    "الوقت هو أثمن ما يملكه الإنسان في حياته، فهو المورد الوحيد الذي إذا ذهب لا يعود أبداً. تنظيم الوقت هو سر النجاح في الحياة العملية والشخصية. الشخص الناجح هو الذي يعرف كيف يستثمر وقته بذكاء، فيوزع ساعاته بين العمل والراحة والعبادة وتطوير الذات. إن إضاعة الوقت في أمور لا فائدة منها هو خسارة كبيرة لا يمكن تعويضها. يجب علينا أن نضع خططاً واضحة لأهدافنا وأن نسعى لتحقيقها بجد واجتهاد. الطباعة السريعة هي إحدى المهارات التي تساعدك على توفير الوقت، فبدلاً من قضاء ساعات في كتابة مستند، يمكنك إنجازه في دقائق معدودة. هذا التوفير في الوقت يمنحك فرصة لتعلم مهارات جديدة أو قضاء وقت ممتع مع العائلة والأصدقاء. تذكر دائماً أن الوقت كالسيف إن لم تقطعه قطعك، فاحرص على استغلال كل لحظة في حياتك بما ينفعك وينفع مجتمعك.",
    "التكنولوجيا الحديثة أصبحت جزءاً لا يتجزأ من حياتنا اليومية، حيث دخلت في كل المجالات من التعليم إلى الصحة إلى العمل. لقد سهلت التكنولوجيا حياتنا وجعلت التواصل بين الناس أسرع وأسهل من أي وقت مضى. ومع ذلك، فإن للتكنولوجيا وجهين، وجهاً إيجابياً وآخر سلبياً. من إيجابياتها توفير المعلومات وسرعة إنجاز المهام وتطور العلوم الطبية. أما سلبياتها فتكمن في الإدمان على الأجهزة الذكية والعزلة الاجتماعية وانتشار المعلومات المغلوطة. لذلك، يجب علينا أن نستخدم التكنولوجيا بحكمة واعتدال، وأن نستفيد من مزاياها ونتجنب عيوبها. تعلم مهارات الحاسوب، ومنها الطباعة السريعة، هو خطوة مهمة لمواكبة هذا التطور التكنولوجي. إن القدرة على التعامل مع الحاسوب بكفاءة تفتح لك أبواباً كثيرة للتعلم والعمل عن بعد، وتجعلك مواطناً رقمياً فعالاً في هذا العصر المتسارع.",
    "القراءة هي مفتاح المعرفة وبوابة العقل إلى عوالم لا حصر لها. من خلال القراءة، نسافر عبر الزمن، نتعرف على ثقافات مختلفة، ونكتسب خبرات لم نعشها بأنفسنا. الكتاب هو الصديق الذي لا يمل، والمعلم الذي لا يكل. في عصر السرعة والإنترنت، قد يظن البعض أن القراءة التقليدية فقدت أهميتها، ولكن الحقيقة هي أن القراءة العميقة لا تزال هي الوسيلة الأفضل لتنمية التفكير النقدي وتوسيع المدارك. القراءة بانتظام تحسن الذاكرة، وتقلل من التوتر، وتزيد من القدرة على التركيز. إذا كنت تريد أن تكون كاتباً جيداً أو متحدثاً لبقاً، فعليك بالقراءة. ابدأ بقراءة كتب بسيطة في مجالات تهمك، ثم انتقل تدريجياً إلى كتب أكثر عمقاً. اجعل القراءة عادة يومية، ولو لصفحات قليلة، وستلاحظ الفرق الكبير في شخصيتك وثقافتك. تذكر أن أمة اقرأ يجب أن تقرأ."
];

const SHORT_TEXTS_EN = [
    "Technology is best when it brings people together. It allows us to connect in ways we never thought possible.",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

const LONG_TEXTS_EN = [
    "Touch typing is a style of typing without looking at the keys. Although touch typing requires special training, it allows you to type much faster and with fewer errors. The fundamental idea is that each finger is given its own section of the keyboard and your fingers learn the location of the keyboard through muscle memory. In today's digital age, typing is a fundamental skill that is used in almost every profession. Whether you are a programmer writing code, a writer crafting a novel, or a student working on an essay, the ability to type quickly and accurately can significantly boost your productivity. It frees your mind to focus on the content rather than the process of entering text. To master touch typing, you must practice regularly. Start by learning the home row keys and then expand to the rest of the keyboard. Remember to keep your posture correct and take breaks to avoid strain. With dedication and practice, you will see your speed and accuracy improve dramatically over time.",
    "Time management is the process of planning and exercising conscious control of time spent on specific activities, especially to increase effectiveness, efficiency, and productivity. It involves a juggling act of various demands upon a person's study, social life, employment, family, and personal interests and commitments with the finiteness of time. Using time effectively gives the person 'choice' on spending or managing activities at their own time and expediency. Time management may be aided by a range of skills, tools, and techniques used to manage time when accomplishing specific tasks, projects, and goals complying with a due date. Initially, time management referred to just business or work activities, but eventually, the term broadened to include personal activities as well. A time management system is a designed combination of processes, tools, techniques, and methods. Time management is usually a necessity in any project development as it determines the project completion time and scope.",
    "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term 'artificial intelligence' had previously been used to describe machines that mimic and display 'human' cognitive skills that are associated with the human mind, such as 'learning' and 'problem-solving'. This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated. AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, automated decision-making, and competing at the highest level in strategic game systems.",
    "A healthy lifestyle is one which helps to keep and improve people's health and well-being. Many governments and non-governmental organizations work at promoting healthy lifestyles. They measure the benefits with critical health numbers, including weight, blood sugar, blood pressure, and blood cholesterol. Healthy living is a lifelong effect. The ways to being healthy include healthy eating, physical activities, weight management, and stress management. Good health allows people to do many things. A healthy lifestyle also includes mental health, which is just as important as physical health. Mental health includes emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life, from childhood and adolescence through adulthood."
];

export default function TypingTestPage() {
    const { t, lang } = useLanguage();

    const textIcons = [BookOpen, Scroll, Feather, FileText];
    const textColors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-amber-500 to-orange-400',
        'from-emerald-500 to-teal-400'
    ];
    const [duration, setDuration] = useState(60);
    const [text, setText] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedTextIndex, setSelectedTextIndex] = useState(0);

    useEffect(() => {
        generateNewTest();
    }, [lang, duration, selectedTextIndex]);

    const generateNewTest = () => {
        const shortTexts = lang === 'ar' ? SHORT_TEXTS_AR : SHORT_TEXTS_EN;
        const longTexts = lang === 'ar' ? LONG_TEXTS_AR : LONG_TEXTS_EN;

        let selectedText;
        if (duration >= 600) {
            // Use selected index for long texts, ensuring it's within bounds
            const index = Math.min(selectedTextIndex, longTexts.length - 1);
            selectedText = longTexts[index];
        } else {
            // Random short text
            const randomIndex = Math.floor(Math.random() * shortTexts.length);
            selectedText = shortTexts[randomIndex];
        }
        setText(selectedText);
        setIsRunning(false);
        setIsFinished(false);
        setResults(null);
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleFinish = (stats) => {
        setIsRunning(false);
        setIsFinished(true);
        if (stats) setResults(stats);
    };

    const handleTimerFinish = () => {
        setIsRunning(false);
        setIsFinished(true);
    };

    const handleTextSelection = (index) => {
        setSelectedTextIndex(index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.test.title}</h1>
                <p className="text-gray-400">{t.test.subtitle}</p>
            </div>

            {!isRunning && !isFinished && (
                <div className="flex flex-col gap-6 items-center mb-8 w-full max-w-2xl mx-auto">
                    <div className={styles.controls}>
                        {[1, 2, 3, 5, 10].map((min) => (
                            <button
                                key={min}
                                className={`${styles.timeOption} ${duration === min * 60 ? styles.active : ''}`}
                                onClick={() => setDuration(min * 60)}
                            >
                                {min} {lang === 'ar' ? 'دقائق' : 'min'}
                            </button>
                        ))}
                    </div>

                    {/* Text Selection for 10 Minutes */}
                    {duration >= 600 && (
                        <div className="w-full animate-fadeIn">
                            <p className="text-center text-gray-400 mb-3 text-sm">
                                {lang === 'ar' ? 'اختر النص الذي تريد كتابته:' : 'Select the text you want to type:'}
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {[0, 1, 2, 3].map((index) => {
                                    const Icon = textIcons[index];
                                    const isSelected = selectedTextIndex === index;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleTextSelection(index)}
                                            className={`relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                                ? 'bg-gray-800 border-transparent shadow-xl scale-105'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                                                }`}
                                        >
                                            {/* Gradient Background for Selected State */}
                                            {isSelected && (
                                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${textColors[index]} opacity-10`} />
                                            )}

                                            {/* Icon with Gradient */}
                                            <div className={`p-3 rounded-full transition-all duration-300 ${isSelected
                                                ? `bg-gradient-to-br ${textColors[index]} text-white shadow-lg`
                                                : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-200'
                                                }`}>
                                                <Icon size={28} strokeWidth={2} />
                                            </div>

                                            <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                                }`}>
                                                {lang === 'ar' ? `النص ${index + 1}` : `Text ${index + 1}`}
                                            </span>

                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${textColors[index]} flex items-center justify-center border-2 border-gray-900`}>
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isFinished ? (
                <div className={styles.testArea}>
                    <div className={styles.timerWrapper}>
                        <Timer duration={duration} isRunning={isRunning} onFinish={handleTimerFinish} />
                    </div>

                    <div onClick={handleStart}>
                        <TypingBox text={text} onComplete={handleFinish} />
                    </div>
                </div>
            ) : (
                <div className={styles.results}>
                    <h2 className="text-3xl font-bold mb-8">{t.test.resultsTitle}</h2>

                    {results ? (
                        <div className={styles.statsGrid}>
                            <div className="text-center">
                                <div className="text-sm text-gray-400 mb-1">{t.common.wpm}</div>
                                <div className="text-5xl font-bold text-indigo-500">{results.wpm} <span className="text-lg">WPM</span></div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-400 mb-1">{t.common.accuracy}</div>
                                <div className="text-5xl font-bold text-indigo-500">{results.accuracy}%</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 text-xl text-yellow-500">
                            {t.test.timeUp}
                        </div>
                    )}

                    <button onClick={generateNewTest} className="btn btn-primary">
                        <RefreshCw size={20} />
                        {t.test.newTest}
                    </button>
                </div>
            )}
        </div>
    );
}
