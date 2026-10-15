// ========================================================
// 🎨 TAILWIND CSS M3-07 PALETTE CONFIGURATION
// ========================================================

tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        // Material 3 Dark Olive Green System v2 (m3.yaml / DESIGN.md / AppColorsM3.kt)
                        screenBg: 'var(--m3-screen-bg)',
                        appBg: 'var(--m3-screen-bg)',
                        background: 'var(--m3-background)',
                        onBackground: 'var(--m3-on-background)',
                        surface: 'var(--m3-surface)',
                        onSurface: 'var(--m3-on-surface)',
                        surfaceVariant: 'var(--m3-surface-variant)',
                        onSurfaceVariant: 'var(--m3-on-surface-variant)',
                        surfaceDim: 'var(--m3-surface-dim)',
                        surfaceBright: 'var(--m3-surface-bright)',
                        surfaceContainerLowest: 'var(--m3-surface-container-lowest)',
                        surfaceContainerLow: 'var(--m3-surface-container-low)',
                        surfaceContainer: 'var(--m3-surface-container)',
                        surfaceContainerHigh: 'var(--m3-surface-container-high)',
                        surfaceContainerHighest: 'var(--m3-surface-container-highest)',

                        primary: 'var(--m3-primary)',
                        onPrimary: 'var(--m3-on-primary)',
                        primaryContainer: 'var(--m3-primary-container)',
                        onPrimaryContainer: 'var(--m3-on-primary-container)',
                        inversePrimary: 'var(--m3-inverse-primary)',

                        secondary: 'var(--m3-secondary)',
                        onSecondary: 'var(--m3-on-secondary)',
                        secondaryContainer: 'var(--m3-secondary-container)',
                        onSecondaryContainer: 'var(--m3-on-secondary-container)',

                        tertiary: 'var(--m3-tertiary)',
                        onTertiary: 'var(--m3-on-tertiary)',
                        tertiaryContainer: 'var(--m3-tertiary-container)',
                        onTertiaryContainer: 'var(--m3-on-tertiary-container)',

                        accentAmber: 'var(--m3-amber-glow)',
                        amberGlow: 'var(--m3-amber-glow)',
                        amberContainer: 'var(--m3-amber-container)',
                        amberText: 'var(--m3-amber-text)',

                        textPrimary: 'var(--m3-on-surface)',
                        textSecondary: 'var(--m3-on-surface-variant)',
                        textTertiary: 'var(--m3-outline)',

                        outline: 'var(--m3-outline)',
                        outlineVariant: 'var(--m3-outline-variant)',
                        inverseSurface: 'var(--m3-inverse-surface)',
                        inverseOnSurface: 'var(--m3-inverse-on-surface)',

                        error: 'var(--m3-error)',
                        onError: 'var(--m3-on-error)',
                        errorContainer: 'var(--m3-error-container)',
                        onErrorContainer: 'var(--m3-on-error-container)',

                        // PRO Badge Tokens (Web Aligned)
                        proGradientStart: '#FBBF24',
                        proGradientMid: '#FCD34D',
                        proGradientEnd: '#EAB308',
                        onPro: '#451A03',

                        success: '#86EFAC',
                        successContainer: '#14532D',

                        // System Aliases for Smooth Compatibility
                        glassBg: 'var(--m3-glass-bg)',
                        glassBorder: 'var(--m3-glass-border)',
                        accentCyan: 'var(--m3-primary)',
                        accentPurple: 'var(--m3-tertiary)',
                        accentPink: 'var(--m3-amber-glow)',
                        textMain: 'var(--m3-on-surface)',
                        textMuted: 'var(--m3-outline)'
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
                    },
                    animation: {
                        'aurora-1': 'aurora 15s ease-in-out infinite alternate',
                        'aurora-2': 'aurora 20s ease-in-out infinite alternate-reverse',
                        'float': 'float 6s ease-in-out infinite',
                    },
                    keyframes: {
                        aurora: {
                            '0%': { transform: 'translate(0, 0) scale(1)' },
                            '100%': { transform: 'translate(20px, -30px) scale(1.1)' },
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-6px)' },
                        }
                    }
                }
            }
        }
