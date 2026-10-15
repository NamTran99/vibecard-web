// ========================================================
// 🌿 M3-07 DARK OLIVE GREEN COLOR SYSTEM (JAVASCRIPT CONSTANTS)
// Dựa trên chuẩn m3.yaml / AppColorsM3.kt / css/m3-tokens.css
// ========================================================

(function(window) {
    'use strict';

    const M3_PALETTE = {
        dark: {
            primary: '#B8D166',
            onPrimary: '#283500',
            primaryContainer: '#3C4D00',
            onPrimaryContainer: '#D4EE7F',

            secondary: '#C4CAA9',
            onSecondary: '#2E331C',
            secondaryContainer: '#444930',
            onSecondaryContainer: '#E0E6C3',

            tertiary: '#A1D0C5',
            onTertiary: '#033730',
            tertiaryContainer: '#214E46',
            onTertiaryContainer: '#BDECE1',

            error: '#FFB4A9',
            onError: '#680003',
            errorContainer: '#930006',
            onErrorContainer: '#FFDAD4',

            background: '#1B1C17',
            onBackground: '#E5E3DB',

            surface: '#1B1C17',
            onSurface: '#E5E3DB',
            surfaceVariant: '#46483C',
            onSurfaceVariant: '#C7C8B8',

            outline: '#909283',
            outlineVariant: '#46483C',

            inverseSurface: '#E5E3DB',
            inverseOnSurface: '#30312B',
            inversePrimary: '#526600',

            surfaceDim: '#0D0E0B',
            surfaceBright: '#3B3C36',
            surfaceContainerLowest: '#0D0E0B',
            surfaceContainerLow: '#1B1C17',
            surfaceContainer: '#20211C',
            surfaceContainerHigh: '#252621',
            surfaceContainerHighest: '#30312B',

            screenBg: '#0D0E0B',
            glassBg: 'rgba(32, 33, 28, 0.75)',
            glassBorder: 'rgba(70, 72, 60, 0.45)',

            amberGlow: '#FBBF24',
            amberContainer: '#3D2E0B',
            amberText: '#FDE68A'
        },
        light: {
            primary: '#526600',
            onPrimary: '#FFFFFF',
            primaryContainer: '#D4EE7F',
            onPrimaryContainer: '#161F00',

            secondary: '#5B6146',
            onSecondary: '#FFFFFF',
            secondaryContainer: '#E0E6C3',
            onSecondaryContainer: '#191D08',

            tertiary: '#3A665E',
            onTertiary: '#FFFFFF',
            tertiaryContainer: '#BDECE1',
            onTertiaryContainer: '#00201B',

            error: '#BA1B1B',
            onError: '#FFFFFF',
            errorContainer: '#FFDAD4',
            onErrorContainer: '#410001',

            background: '#FEFCF4',
            onBackground: '#1B1C17',

            surface: '#FEFCF4',
            onSurface: '#1B1C17',
            surfaceVariant: '#E3E4D3',
            onSurfaceVariant: '#46483C',

            outline: '#77786B',
            outlineVariant: '#C7C8B8',

            inverseSurface: '#30312B',
            inverseOnSurface: '#F3F1E9',
            inversePrimary: '#B8D166',

            surfaceDim: '#D6D5CD',
            surfaceBright: '#FEFCF4',
            surfaceContainerLowest: '#FFFFFF',
            surfaceContainerLow: '#F3F1E9',
            surfaceContainer: '#F3F1E9',
            surfaceContainerHigh: '#ECEAE2',
            surfaceContainerHighest: '#E5E3DB',

            screenBg: '#FEFCF4',
            glassBg: 'rgba(254, 252, 244, 0.85)',
            glassBorder: 'rgba(227, 228, 211, 0.75)',

            amberGlow: '#D97706',
            amberContainer: '#FEF3C7',
            amberText: '#92400E'
        }
    };

    // Semantic Navigation Color Themes for Bottom Nav Items (0: Home, 1: Create, 2: Library, 3: Profile)
    const M3_NAV_THEMES = [
        { name: 'Home', activeColor: 'text-[#B8D166]', inactiveColor: 'text-[#C7C8B8]' },
        { name: 'Create', activeColor: 'text-[#B8D166]', inactiveColor: 'text-[#C7C8B8]' },
        { name: 'Library', activeColor: 'text-[#B8D166]', inactiveColor: 'text-[#C7C8B8]' },
        { name: 'Profile', activeColor: 'text-[#B8D166]', inactiveColor: 'text-[#C7C8B8]' }
    ];

    const M3Colors = {
        palette: M3_PALETTE,
        navThemes: M3_NAV_THEMES,

        isDarkMode() {
            return document.documentElement.classList.contains('dark') || 
                   (!document.documentElement.classList.contains('light') && 
                    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        },

        getCurrentTheme() {
            return this.isDarkMode() ? M3_PALETTE.dark : M3_PALETTE.light;
        },

        get(token) {
            const current = this.getCurrentTheme();
            return current[token] || M3_PALETTE.dark[token] || '#B8D166';
        },

        rgba(hex, alpha = 1) {
            const cleanHex = hex.replace('#', '');
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    };

    window.M3Colors = M3Colors;
    window.m3NavThemes = M3_NAV_THEMES; // Backward compatibility

})(window);
