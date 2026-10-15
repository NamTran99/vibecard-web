// ========================================================
// 📦 REACTIVE APP STORE (SINGLE SOURCE OF TRUTH)
// ========================================================

(function(window) {
    'use strict';

    class ReactiveAppStore {
        constructor() {
            this._state = {
                currentTab: 0,
                themeMode: localStorage.getItem('mindcard-theme-mode') || 'dark',
                targetLang: localStorage.getItem('mindcard-target-lang') || 'EN',
                targetFlag: localStorage.getItem('mindcard-target-flag') || '🇺🇸',
                activeWord: 'resilient',
                isSlowAudio: false,
                stagedWords: [],
                recentSearches: ['resilient', 'break the ice', 'serendipity', 'ubiquitous', 'ephemeral'],
                bookmarkedWords: new Set(['resilient']),
                userXP: 350,
                studyStreakDays: 7
            };

            this._listeners = new Map();
        }

        getState(key) {
            if (key) {
                return this._state[key];
            }
            return { ...this._state };
        }

        setState(key, value) {
            const oldValue = this._state[key];
            if (oldValue === value) return;

            this._state[key] = value;
            this._notify(key, value, oldValue);
        }

        updateState(partial) {
            Object.keys(partial).forEach(k => {
                this.setState(k, partial[k]);
            });
        }

        subscribe(key, listener) {
            if (!this._listeners.has(key)) {
                this._listeners.set(key, new Set());
            }
            this._listeners.get(key).add(listener);

            // Return unsubscribe function
            return () => {
                const set = this._listeners.get(key);
                if (set) {
                    set.delete(listener);
                }
            };
        }

        _notify(key, newValue, oldValue) {
            // Specific key listeners
            if (this._listeners.has(key)) {
                this._listeners.get(key).forEach(fn => {
                    try {
                        fn(newValue, oldValue);
                    } catch (e) {
                        console.error(`[AppStore] Error in listener for ${key}:`, e);
                    }
                });
            }

            // Global '*' wildcard listeners
            if (this._listeners.has('*')) {
                this._listeners.get('*').forEach(fn => {
                    try {
                        fn(key, newValue, oldValue);
                    } catch (e) {
                        console.error('[AppStore] Error in global listener:', e);
                    }
                });
            }
        }
    }

    window.AppStore = new ReactiveAppStore();

    // Auto sync themeMode and targetLang to localStorage
    window.AppStore.subscribe('themeMode', (mode) => {
        try {
            localStorage.setItem('mindcard-theme-mode', mode);
        } catch (e) {}
    });

    window.AppStore.subscribe('targetLang', (lang) => {
        try {
            localStorage.setItem('mindcard-target-lang', lang);
        } catch (e) {}
    });

    window.AppStore.subscribe('targetFlag', (flag) => {
        try {
            localStorage.setItem('mindcard-target-flag', flag);
        } catch (e) {}
    });

})(window);
