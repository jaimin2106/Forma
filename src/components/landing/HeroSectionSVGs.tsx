import React from 'react';
import { motion } from 'framer-motion';

// Common colors
const colors = {
    bg: "#f8fafc",
    sidebar: "#ffffff",
    border: "#e2e8f0",
    primary: "#6366f1",
    secondary: "#64748b",
    success: "#10b981",
    text: "#1e293b",
    muted: "#94a3b8"
};

export const FormBuilderSVG = () => (
    <svg viewBox="0 0 800 500" className="w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-inner">
        <defs>
            <filter id="shadow-sm" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.05" />
            </filter>
            <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>

        {/* Sidebar */}
        <rect x="0" y="0" width="200" height="500" fill="#ffffff" stroke={colors.border} strokeWidth="1" />
        <rect x="20" y="20" width="120" height="24" rx="4" fill={colors.border} opacity="0.5" />
        <rect x="20" y="60" width="160" height="40" rx="6" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
        <rect x="35" y="72" width="16" height="16" rx="3" fill={colors.primary} opacity="0.2" />
        <rect x="65" y="75" width="80" height="10" rx="2" fill={colors.text} opacity="0.8" />

        <rect x="20" y="110" width="160" height="40" rx="6" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
        <rect x="35" y="122" width="16" height="16" rx="3" fill="#ec4899" opacity="0.2" />
        <rect x="65" y="125" width="60" height="10" rx="2" fill={colors.text} opacity="0.8" />

        <rect x="20" y="160" width="160" height="40" rx="6" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
        <rect x="35" y="172" width="16" height="16" rx="3" fill="#10b981" opacity="0.2" />
        <rect x="65" y="175" width="70" height="10" rx="2" fill={colors.text} opacity="0.8" />

        {/* Main Canvas */}
        <rect x="240" y="40" width="520" height="420" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />

        {/* Form Header */}
        <rect x="280" y="80" width="200" height="24" rx="4" fill={colors.text} opacity="0.9" />
        <rect x="280" y="115" width="300" height="14" rx="2" fill={colors.muted} opacity="0.6" />

        {/* Input Field 1 */}
        <g transform="translate(280, 160)">
            <rect x="0" y="0" width="100" height="12" rx="2" fill={colors.secondary} opacity="0.8" />
            <rect x="0" y="20" width="440" height="40" rx="6" fill={colors.bg} stroke={colors.border} strokeWidth="1" />
            <rect x="15" y="32" width="120" height="16" rx="2" fill={colors.muted} opacity="0.3" />
        </g>

        {/* Input Field 2 */}
        <g transform="translate(280, 240)">
            <rect x="0" y="0" width="140" height="12" rx="2" fill={colors.secondary} opacity="0.8" />
            <rect x="0" y="20" width="440" height="40" rx="6" fill={colors.bg} stroke={colors.border} strokeWidth="1" />
            <circle cx="410" cy="40" r="10" fill={colors.success} opacity="0.2" />
            <path d="M406 40 L409 43 L414 37" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="15" y="32" width="180" height="16" rx="2" fill={colors.text} opacity="0.8" />
        </g>

        {/* Button */}
        <rect x="280" y="320" width="120" height="40" rx="20" fill="url(#primary-grad)" />
        <rect x="315" y="332" width="50" height="16" rx="2" fill="#ffffff" />

        {/* Cursor */}
        <path d="M500 280 L515 320 L525 310 L545 330 L555 320 L535 300 L550 295 Z" fill="#000000" stroke="#ffffff" strokeWidth="2" />
    </svg>
);

export const DashboardSVG = () => (
    <svg viewBox="0 0 800 500" className="w-full h-full bg-slate-50 rounded-xl overflow-hidden">
        <defs>
            <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Top Nav */}
        <rect x="0" y="0" width="800" height="60" fill="#ffffff" stroke={colors.border} strokeWidth="1" />
        <circle cx="40" cy="30" r="16" fill={colors.primary} />
        <rect x="80" y="20" width="100" height="20" rx="4" fill={colors.muted} opacity="0.3" />
        <rect x="680" y="15" width="30" height="30" rx="15" fill={colors.bg} stroke={colors.border} />
        <rect x="730" y="15" width="30" height="30" rx="15" fill={colors.bg} stroke={colors.border} />

        {/* 3 Stats Cards */}
        <g transform="translate(40, 100)">
            <rect width="220" height="120" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            <rect x="20" y="20" width="30" height="30" rx="6" fill="#dbeafe" />
            <path d="M35 35 L35 25 M30 30 L40 30" stroke="#2563eb" strokeWidth="2" fill="none" transform="rotate(45 35 30)" />
            <rect x="20" y="65" width="80" height="14" rx="2" fill={colors.secondary} />
            <rect x="20" y="85" width="120" height="24" rx="4" fill={colors.text} />
            {/* Trend line */}
            <path d="M160 80 Q175 60 190 70 T210 50" fill="none" stroke="#10b981" strokeWidth="2" />
        </g>

        <g transform="translate(290, 100)">
            <rect width="220" height="120" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            <rect x="20" y="20" width="30" height="30" rx="6" fill="#fce7f3" />
            <rect x="20" y="65" width="80" height="14" rx="2" fill={colors.secondary} />
            <rect x="20" y="85" width="120" height="24" rx="4" fill={colors.text} />
            <circle cx="180" cy="60" r="25" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <path d="M180 35 A25 25 0 0 1 205 60" fill="none" stroke="#ec4899" strokeWidth="4" />
        </g>

        <g transform="translate(540, 100)">
            <rect width="220" height="120" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            <rect x="20" y="20" width="30" height="30" rx="6" fill="#d1fae5" />
            <rect x="20" y="65" width="80" height="14" rx="2" fill={colors.secondary} />
            <rect x="20" y="85" width="120" height="24" rx="4" fill={colors.text} />
        </g>

        {/* Main Chart */}
        <g transform="translate(40, 260)">
            <rect width="470" height="200" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            <rect x="20" y="20" width="100" height="20" rx="4" fill={colors.text} opacity="0.8" />

            {/* Grid lines */}
            <line x1="20" y1="60" x2="450" y2="60" stroke={colors.border} strokeDasharray="4 4" />
            <line x1="20" y1="100" x2="450" y2="100" stroke={colors.border} strokeDasharray="4 4" />
            <line x1="20" y1="140" x2="450" y2="140" stroke={colors.border} strokeDasharray="4 4" />
            <line x1="20" y1="180" x2="450" y2="180" stroke={colors.border} strokeDasharray="4 4" />

            {/* Area Chart */}
            <path d="M20 180 L20 140 Q60 120 100 150 T180 100 T260 130 T340 80 T420 110 L450 100 L450 180 Z" fill="url(#chart-grad)" />
            <path d="M20 140 Q60 120 100 150 T180 100 T260 130 T340 80 T420 110 L450 100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Side bar chart */}
        <g transform="translate(540, 260)">
            <rect width="220" height="200" rx="8" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            <rect x="20" y="20" width="80" height="20" rx="4" fill={colors.text} opacity="0.8" />

            {/* Bars */}
            <rect x="30" y="70" width="20" height="110" rx="2" fill="#eff6ff" />
            <rect x="30" y="100" width="20" height="80" rx="2" fill="#3b82f6" />

            <rect x="80" y="70" width="20" height="110" rx="2" fill="#eff6ff" />
            <rect x="80" y="80" width="20" height="100" rx="2" fill="#3b82f6" opacity="0.7" />

            <rect x="130" y="70" width="20" height="110" rx="2" fill="#eff6ff" />
            <rect x="130" y="120" width="20" height="60" rx="2" fill="#3b82f6" opacity="0.4" />

            <rect x="180" y="70" width="20" height="110" rx="2" fill="#eff6ff" />
            <rect x="180" y="90" width="20" height="90" rx="2" fill="#3b82f6" opacity="0.6" />
        </g>
    </svg>
);

export const CustomizerSVG = () => (
    <svg viewBox="0 0 800 500" className="w-full h-full bg-slate-50 rounded-xl overflow-hidden">
        {/* Split container */}
        <rect x="0" y="0" width="260" height="500" fill="#ffffff" stroke={colors.border} strokeWidth="1" />

        {/* Customizer Controls */}
        <rect x="30" y="40" width="120" height="24" rx="4" fill={colors.text} />

        {/* Colors */}
        <text x="30" y="100" fontFamily="sans-serif" fontSize="12" fill={colors.muted} fontWeight="bold">BRAND COLORS</text>
        <circle cx="45" cy="130" r="15" fill="#ec4899" stroke="#000" strokeWidth="2" />
        <circle cx="85" cy="130" r="15" fill="#8b5cf6" />
        <circle cx="125" cy="130" r="15" fill="#f59e0b" />
        <circle cx="165" cy="130" r="15" fill="#10b981" />

        {/* Typography */}
        <text x="30" y="180" fontFamily="sans-serif" fontSize="12" fill={colors.muted} fontWeight="bold">TYPOGRAPHY</text>
        <rect x="30" y="200" width="200" height="40" rx="6" fill={colors.bg} stroke={colors.border} />
        <rect x="45" y="212" width="100" height="16" rx="2" fill={colors.text} opacity="0.8" />
        <path d="M210 215 L220 220 L210 225" fill={colors.muted} />

        {/* Roundedness */}
        <text x="30" y="270" fontFamily="sans-serif" fontSize="12" fill={colors.muted} fontWeight="bold">ROUNDEDNESS</text>
        <line x1="30" y1="300" x2="230" y2="300" stroke={colors.border} strokeWidth="4" strokeLinecap="round" />
        <circle cx="140" cy="300" r="8" fill="#ffffff" stroke={colors.primary} strokeWidth="3" />

        {/* Preview Area */}
        <g transform="translate(320, 40)">
            <rect width="440" height="420" rx="12" fill="#ffffff" stroke={colors.border} strokeWidth="1" filter="url(#shadow-sm)" />
            {/* Header */}
            <rect x="0" y="0" width="440" height="80" rx="12" fill="#ec4899" fillOpacity="0.1" />
            <path d="M0 0 L440 0 L440 20 L0 20 Z" fill="#ec4899" />

            {/* Content */}
            <rect x="40" y="110" width="200" height="30" rx="4" fill={colors.text} />
            <rect x="40" y="150" width="360" height="16" rx="2" fill={colors.secondary} opacity="0.6" />
            <rect x="40" y="175" width="280" height="16" rx="2" fill={colors.secondary} opacity="0.6" />

            {/* Styled Button */}
            <rect x="40" y="230" width="140" height="48" rx="24" fill="#ec4899" />
            <rect x="75" y="246" width="70" height="16" rx="2" fill="#ffffff" />
        </g>
    </svg>
);
