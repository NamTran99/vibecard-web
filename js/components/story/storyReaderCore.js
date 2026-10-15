/**
 * ==========================================================================
 * 📖 STORY TO CARD READER CORE CONTROLLER (SCREEN LIFECYCLE & FLIP NAVIGATION)
 * 1:1 Pixel-Perfect Replica from Android Native MainActivityStoryReader.kt
 * Separated according to SRP (< 350 lines/file rule)
 * ==========================================================================
 */

(function () {
    'use strict';

    function safeStopStoryAudio() {
        try {
            if (typeof window.stopStoryAudio === 'function') {
                window.stopStoryAudio();
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        } catch (e) {}
    }

    /**
     * Mở màn hình đọc truyện Story to Card
     */
    window.openStoryReaderScreen = function (customLessonData = null) {
        const screen = document.getElementById('screenStoryReader');
        if (screen) {
            screen.classList.remove('hidden', 'translate-x-full');
            screen.style.display = 'flex';
            screen.style.zIndex = '10000';
            screen.style.transform = 'none';
            screen.style.opacity = '1';
        }

        const competingModals = ['reviewDeckModal', 'screenLessonIntro', 'storybookSpreadModal', 'flashcardCreatedModal'];
        competingModals.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.style.display = 'none';
            }
        });

        try {
            const state = window.StoryReaderState || {
                currentStory: window.DEFAULT_STORY_DATA,
                currentPartIndex: 0,
                currentWordIndex: 0,
                isTranslationVisible: false,
                isAudioPlaying: false,
                activeUtterance: null,
                isFlipping: false,
                isTargetCardExpanded: false,
                wordClassifications: {},
                extraVocabularyItems: {},
                phraseDraftTokens: [],
                activePopupWord: null,
                settings: { audioSpeed: 1.0, autoTranslate: false, fontSizeMultiplier: 1.0 }
            };
            window.StoryReaderState = state;

            if (customLessonData && customLessonData.parts && customLessonData.parts.length > 0) {
                state.currentStory = customLessonData;
            } else if (customLessonData && customLessonData.storyParts && customLessonData.storyParts.length > 0) {
                state.currentStory = {
                    id: customLessonData.id || "lesson_custom",
                    title: customLessonData.title || "Bài đọc truyện",
                    totalParts: customLessonData.storyParts.length,
                    parts: customLessonData.storyParts
                };
            } else {
                state.currentStory = window.DEFAULT_STORY_DATA;
            }

            state.currentPartIndex = 0;
            state.currentWordIndex = 0;
            state.isTargetCardExpanded = false;
            state.isTranslationVisible = state.settings ? state.settings.autoTranslate : false;
        } catch (stateErr) {
            console.error('[StoryReader] Error initializing state:', stateErr);
        }

        safeStopStoryAudio();

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }

        try {
            if (window.StoryReaderUI && typeof window.StoryReaderUI.renderStoryUI === 'function') {
                window.StoryReaderUI.renderStoryUI();
            }
        } catch (renderErr) {
            console.error('[StoryReader] Error in renderStoryUI:', renderErr);
        }

        try {
            if (typeof window.setupStoryTouchGestures === 'function') {
                window.setupStoryTouchGestures();
            }
        } catch (gestErr) {
            console.error('[StoryReader] Error in setupStoryTouchGestures:', gestErr);
        }

        try {
            history.replaceState(null, '', '#story');
        } catch (e) {}
    };

    /**
     * Đóng màn hình đọc truyện
     */
    window.closeStoryReaderScreen = function () {
        safeStopStoryAudio();
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        if (typeof window.cancelStoryPhraseDraft === 'function') window.cancelStoryPhraseDraft();

        const screen = document.getElementById('screenStoryReader');
        if (!screen) return;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(8); } catch (e) {}
        }

        screen.style.opacity = '0';
        setTimeout(() => {
            screen.classList.add('hidden');
            screen.style.display = 'none';
        }, 220);

        try {
            if (window.location.hash === '#story') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        } catch (e) {}
    };

    /**
     * Chuyển sang đoạn tiếp theo với hiệu ứng lật trang 3D
     */
    window.storyReaderNextPart = function () {
        const state = window.StoryReaderState;
        if (state.isFlipping) return;
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        if (typeof window.cancelStoryPhraseDraft === 'function') window.cancelStoryPhraseDraft();

        const parts = state.currentStory.parts || [];
        const total = parts.length || 1;
        const currentPart = parts[state.currentPartIndex] || {};
        const words = currentPart.targetWords || [];

        const unclassifiedCount = words.filter(w => state.wordClassifications[w.term] === undefined).length;
        if (unclassifiedCount > 0) {
            if (!state.isTargetCardExpanded) {
                window.toggleStoryTargetCardExpand(true);
            }
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                try { SoundEngine.play(8); } catch (e) {}
            }
            if (typeof showDictToast === 'function') {
                showDictToast(`🔒 Bạn còn ${unclassifiedCount} từ cần phân loại trước khi tiếp tục!`);
            }
            const cardContainer = document.getElementById('storyTargetCardContainer');
            if (cardContainer) {
                setTimeout(() => cardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
            }
            return;
        }

        if (state.currentPartIndex >= total - 1) {
            if (typeof window.completeStoryLesson === 'function') {
                window.completeStoryLesson();
            } else if (typeof completeStoryLesson === 'function') {
                completeStoryLesson();
            }
            return;
        }

        safeStopStoryAudio();
        state.isFlipping = true;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }

        const flipPage = document.getElementById('storyFlipPage');
        const bookShell = document.getElementById('storyBookShell');
        if (flipPage) {
            flipPage.classList.add('flip-out-left');
            setTimeout(() => {
                state.currentPartIndex++;
                state.currentWordIndex = 0;
                state.isTargetCardExpanded = false;
                window.StoryReaderUI.renderStoryUI();
                if (bookShell) bookShell.scrollTo({ top: 0, behavior: 'smooth' });
                flipPage.classList.remove('flip-out-left');
                flipPage.classList.add('flip-in-right');
                setTimeout(() => {
                    flipPage.classList.remove('flip-in-right');
                    state.isFlipping = false;
                }, 300);
            }, 140);
        } else {
            state.currentPartIndex++;
            state.currentWordIndex = 0;
            state.isTargetCardExpanded = false;
            window.StoryReaderUI.renderStoryUI();
            if (bookShell) bookShell.scrollTo({ top: 0, behavior: 'smooth' });
            state.isFlipping = false;
        }
    };

    /**
     * Quay lại đoạn trước với hiệu ứng lật trang 3D
     */
    window.storyReaderPrevPart = function () {
        const state = window.StoryReaderState;
        if (state.isFlipping || state.currentPartIndex <= 0) return;
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        if (typeof window.cancelStoryPhraseDraft === 'function') window.cancelStoryPhraseDraft();

        safeStopStoryAudio();
        state.isFlipping = true;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }

        const flipPage = document.getElementById('storyFlipPage');
        const bookShell = document.getElementById('storyBookShell');
        if (flipPage) {
            flipPage.classList.add('flip-out-right');
            setTimeout(() => {
                state.currentPartIndex--;
                state.currentWordIndex = 0;
                state.isTargetCardExpanded = false;
                window.StoryReaderUI.renderStoryUI();
                if (bookShell) bookShell.scrollTo({ top: 0, behavior: 'smooth' });
                flipPage.classList.remove('flip-out-right');
                flipPage.classList.add('flip-in-left');
                setTimeout(() => {
                    flipPage.classList.remove('flip-in-left');
                    state.isFlipping = false;
                }, 300);
            }, 140);
        } else {
            state.currentPartIndex--;
            state.currentWordIndex = 0;
            state.isTargetCardExpanded = false;
            window.StoryReaderUI.renderStoryUI();
            if (bookShell) bookShell.scrollTo({ top: 0, behavior: 'smooth' });
            state.isFlipping = false;
        }
    };

    window.storyReaderGoToPart = function (targetIdx) {
        const state = window.StoryReaderState;
        const parts = (state && state.currentStory && state.currentStory.parts) || [];
        if (!state || state.isFlipping || targetIdx < 0 || targetIdx >= parts.length || targetIdx === state.currentPartIndex) return;
        for (let i = 0; i < targetIdx; i++) {
            const pWords = (parts[i] && parts[i].targetWords) || [];
            const missing = pWords.filter(w => state.wordClassifications[w.term] === undefined).length;
            if (missing > 0) {
                if (!state.isTargetCardExpanded) window.toggleStoryTargetCardExpand(true);
                if (typeof showDictToast === 'function') showDictToast(`🔒 Hãy phân loại hết từ vựng ở Phần ${i + 1} trước khi mở Phần ${targetIdx + 1}!`);
                return;
            }
        }
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        if (typeof window.cancelStoryPhraseDraft === 'function') window.cancelStoryPhraseDraft();
        safeStopStoryAudio();
        state.currentPartIndex = targetIdx;
        state.currentWordIndex = 0;
        state.isTargetCardExpanded = false;
        window.StoryReaderUI.renderStoryUI();
        const bookShell = document.getElementById('storyBookShell');
        if (bookShell) bookShell.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Bật / Tắt dịch nghĩa đoạn
     */
    window.toggleStoryTranslation = function () {
        const state = window.StoryReaderState;
        state.isTranslationVisible = !state.isTranslationVisible;
        const translationBox = document.getElementById('storyTranslationBox');
        const translateBtn = document.getElementById('storyTranslateBtn');
        if (!translationBox) return;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }

        if (state.isTranslationVisible) {
            translationBox.classList.remove('hidden');
            translationBox.style.display = 'block';
            if (translateBtn) translateBtn.classList.add('active-trans');
            requestAnimationFrame(() => {
                translationBox.style.opacity = '1';
            });
        } else {
            if (translateBtn) translateBtn.classList.remove('active-trans');
            translationBox.style.opacity = '0';
            setTimeout(() => {
                translationBox.classList.add('hidden');
                translationBox.style.display = 'none';
            }, 200);
        }
    };

    /**
     * Chạm vào ảnh bài học: Bật / Tắt thanh Topbar HUD (như Apple Books / Webtoon)
     * - Nếu Topbar đang hiện -> ẩn ngay lập tức để ngắm trọn 100% ảnh 16:9 không vướng nút.
     * - Nếu Topbar đang ẩn -> hiện lại Topbar trong 2.8s để bấm Quay lại / Cài đặt.
     */
    window.toggleStoryHeroCinemaPeek = function () {
        const header = document.getElementById('storyHeroHeader');
        if (!header) return;
        const isHidden = header.classList.contains('story-header-auto-hidden');
        if (isHidden) {
            if (typeof window.revealStoryHeroHeaderTemporarily === 'function') {
                window.revealStoryHeroHeaderTemporarily();
            } else {
                header.classList.remove('story-header-auto-hidden');
            }
        } else {
            header.classList.add('story-header-auto-hidden');
        }
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }
    };
})();
