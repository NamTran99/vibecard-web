// ========================================================
// 🚀 APP ENTRYPOINT & GLOBAL EVENT INITIALIZATION
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Reactive AppStore State
    if (window.AppStore) {
        const theme = window.AppStore.getState('themeMode');
        applyThemeMode(theme);

        const lang = window.AppStore.getState('targetLang');
        const flag = window.AppStore.getState('targetFlag');
        const flagEl = document.getElementById('topLangFlag');
        const codeEl = document.getElementById('topLangCode');
        if (flagEl) flagEl.innerText = flag;
        if (codeEl) codeEl.innerText = lang;

        if (typeof updateDictionaryBookLanguage === 'function') updateDictionaryBookLanguage(lang);
        if (typeof applyTargetLanguageUI === 'function') applyTargetLanguageUI(lang);
    } else {
        try {
            const savedTheme = localStorage.getItem('mindcard-theme-mode') || 'dark';
            applyThemeMode(savedTheme);
        } catch (e) {}
    }

    try {
        checkLumiTipVisibility();
    } catch (e) {}

    // 2. Auto-purge Stale Service Worker and Caches during local development
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ('caches' in window) {
        caches.keys().then((names) => {
            for (let name of names) caches.delete(name);
        });
    }

    // 3. Đảm bảo modal Flashcard cũ không bung lên và hỗ trợ mở Story Reader 1:1 Android Native
    setTimeout(() => {
        const deckModal = document.getElementById('reviewDeckModal');
        if (deckModal) {
            deckModal.classList.add('hidden');
            deckModal.style.display = 'none';
        }

        if (window.location.hash === '#story' || window.location.search.includes('story=true')) {
            if (typeof window.openStoryReaderScreen === 'function') {
                window.openStoryReaderScreen();
            }
        }
    }, 120);
});

// System Theme Change Listener
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        try {
            const currentMode = localStorage.getItem('mindcard-theme-mode');
            if (currentMode === 'system') {
                applyThemeMode('system');
            }
        } catch (e) {}
    });
}

// Fallback handlers for legacy simulation modals
window.closePronunciationPractice = function () {
    const m = document.getElementById('pronunciationPracticeModal');
    if (m) m.classList.add('hidden');
};
window.togglePracticeRecording = function () {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    const box = document.getElementById('practiceFeedbackBox');
    if (box) box.classList.toggle('hidden');
};
window.closeOcrScanner = function () {
    const m = document.getElementById('ocrModal');
    if (m) m.classList.add('hidden');
};

