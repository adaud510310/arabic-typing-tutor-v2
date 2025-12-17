"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLanguage } from "@/context/LanguageContext";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function DashboardChart({ data }) {
    const { t } = useLanguage();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Outfit' }
                }
            },
        },
        scales: {
            y: {
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    const labels = data.map((_, index) => `تمرين ${index + 1}`);
    const wpmData = data.map(p => p.wpm);
    const accuracyData = data.map(p => p.accuracy);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'السرعة (WPM)',
                data: wpmData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'الدقة (%)',
                data: accuracyData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return <Line options={options} data={chartData} />;
}
