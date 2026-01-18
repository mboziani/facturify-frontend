import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    variant?: 'light' | 'dark' | 'color';
}

export const Logo: React.FC<LogoProps> = ({
    className = "w-8 h-8",
    showText = true,
    variant = 'color'
}) => {
    // Gradient definitions for reusability
    const Gradient = () => (
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
                <stop offset="100%" stopColor="#7C3AED" /> {/* Violet-600 */}
            </linearGradient>
            <linearGradient id="logo-gradient-dark" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" /> {/* Indigo-400 */}
                <stop offset="100%" stopColor="#A78BFA" /> {/* Violet-400 */}
            </linearGradient>
        </defs>
    );

    const fillColor = variant === 'color' ? 'url(#logo-gradient)' : 'currentColor';
    const textColor = variant === 'dark' ? 'text-white' : 'text-slate-900';

    return (
        <div className={`flex items-center ${variant === 'dark' ? 'text-white' : 'text-indigo-600'}`}>
            <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                aria-label="Facturify Logo"
            >
                <Gradient />

                {/* Abstract shape: Rising bars forming an F / Shield */}
                <path
                    d="M10 30C10 31.1046 10.8954 32 12 32H28C29.1046 32 30 31.1046 30 30V10C30 8.89543 29.1046 8 28 8H12C10.8954 8 10 8.89543 10 10V30Z"
                    fill={fillColor}
                    fillOpacity="0.1"
                />

                {/* Main Dynamic Element */}
                <path
                    d="M14 26H18V18H14V26Z"
                    fill={fillColor}
                />
                <path
                    d="M22 26H26V14H22V26Z"
                    fill={fillColor}
                />

                {/* Connecting Line (Data Flow) */}
                <path
                    d="M10 16L18 16"
                    stroke={fillColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>

            {showText && (
                <span className={`font-bold tracking-tight text-xl ${textColor}`}>
                    Facturify
                </span>
            )}
        </div>
    );
};
