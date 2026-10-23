(function() {
    'use strict';

    let touchStartX = 0, touchStartY = 0;
    let karaokeTimer = null, karaokeState = null;

    function getKaraokeSpans(scopeSel) {
        const pEl = document.getElementById('storyParagraphText');
        if (!pEl) return [];
        const root = (scopeSel && scopeSel !== '#storyParagraphText') ? (pEl.querySelector(scopeSel) || pEl) : pEl;
        return Array.from(root.querySelectorAll('[data-char-start]'));
    }

    function renderKaraokeSpanIndex(spans, activeIdx) {
        const pEl = document.getElementById('storyParagraphText');
        if (!pEl || !spans.length) return;
        pEl.classList.add('is-karaoke-reading');
        for (let i = 0; i < spans.length; i++) {
            spans[i].classList.toggle('is-karaoke-past', i < activeIdx);
            spans[i].classList.toggle('is-karaoke-active', i === activeIdx);
        }
        if (karaokeState) karaokeState.activeIdx = activeIdx;
    }

    function applyKaraokeAtChar(charIndex, scopeSel, isRelative) {
        const spans = getKaraokeSpans(scopeSel);
        if (!spans.length) return;
        const baseOffset = isRelative ? (Number(spans[0].getAttribute('data-char-start')) || 0) : 0;
        const absChar = baseOffset + charIndex;
        let activeIdx = 0;
        for (let i = 0; i < spans.length; i++) {
            const s = Number(spans[i].getAttribute('data-char-start')) || 0;
            const e = Number(spans[i].getAttribute('data-char-end')) || s;
            if (absChar >= s && absChar < e) { activeIdx = i; break; }
            if (s <= absChar + 1) activeIdx = i;
        }
        renderKaraokeSpanIndex(spans, activeIdx);
    }

    window.clearStoryKaraokeHighlight = function () {
        if (karaokeTimer) { clearTimeout(karaokeTimer); karaokeTimer = null; }
        karaokeState = null;
        const pEl = document.getElementById('storyParagraphText');
        if (!pEl) return;
        pEl.classList.remove('is-karaoke-reading');
        pEl.querySelectorAll('.is-karaoke-active, .is-karaoke-past').forEach(el => {
            el.classList.remove('is-karaoke-active', 'is-karaoke-past');
        });
    };

    window.reapplyStoryKaraokeHighlight = function () {
        if (!karaokeState) return;
        const spans = getKaraokeSpans(karaokeState.scopeSel);
        if (spans.length) renderKaraokeSpanIndex(spans, Math.min(karaokeState.activeIdx || 0, spans.length - 1));
    };

    window.attachStoryKaraokeSync = function (utterance, scopeSel, isRelative, rate) {
        window.clearStoryKaraokeHighlight();
        const spans = getKaraokeSpans(scopeSel);
        if (!spans.length) return;
        const speed = rate || 1.0;
        karaokeState = { scopeSel: scopeSel || '#storyParagraphText', isRelative: Boolean(isRelative), activeIdx: 0, boundaryFired: false };
        renderKaraokeSpanIndex(spans, 0);

        function scheduleFallbackStep(idx) {
            if (karaokeTimer) clearTimeout(karaokeTimer);
            if (!karaokeState || karaokeState.boundaryFired || idx >= spans.length) return;
            const curSpans = getKaraokeSpans(scopeSel);
            const sp = curSpans[idx] || spans[idx];
            const wordLen = sp ? (sp.textContent || "").length : 4;
            const nextS = (idx + 1 < spans.length) ? Number(spans[idx + 1].getAttribute('data-char-start')) : 0;
            const curE = sp ? Number(sp.getAttribute('data-char-end')) : 0;
            const gapPause = (nextS - curE > 1) ? 140 : 0;
            const delay = Math.max(155, Math.min(540, Math.round((wordLen * 48 + 90 + gapPause) / speed)));
            karaokeTimer = setTimeout(() => {
                if (!karaokeState || karaokeState.boundaryFired) return;
                const nextIdx = idx + 1;
                if (nextIdx < curSpans.length) {
                    renderKaraokeSpanIndex(curSpans, nextIdx);
                    scheduleFallbackStep(nextIdx);
                }
            }, delay);
        }

        utterance.addEventListener('start', () => {
            const curSpans = getKaraokeSpans(scopeSel);
            if (curSpans.length) renderKaraokeSpanIndex(curSpans, 0);
            scheduleFallbackStep(0);
        });
        utterance.addEventListener('boundary', (e) => {
            if (!e || typeof e.charIndex !== 'number') return;
            if (karaokeState) karaokeState.boundaryFired = true;
            if (karaokeTimer) { clearTimeout(karaokeTimer); karaokeTimer = null; }
            applyKaraokeAtChar(e.charIndex, scopeSel, isRelative);
        });
        utterance.addEventListener('end', () => window.clearStoryKaraokeHighlight());
        utterance.addEventListener('error', () => window.clearStoryKaraokeHighlight());
        scheduleFallbackStep(0);
    };

    window.toggleStoryAudioPlayback = function () {
        const state = window.StoryReaderState;
        if (state.isAudioPlaying) stopStoryAudio();
        else playStoryAudio();
    };

    function playStoryAudio() {
        stopStoryAudio();
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        if (!currentPart) return;
        const textToRead = currentPart.contentEn || currentPart.contentVi || currentPart.content || "";
        if (!textToRead) return;

        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const rate = (state.settings && state.settings.audioSpeed) || 1.0;
                state.activeUtterance = new SpeechSynthesisUtterance(textToRead);
                state.activeUtterance.rate = rate;
                state.activeUtterance.lang = currentPart.contentEn ? 'en-US' : 'vi-VN';

                state.activeUtterance.onstart = function () {
                    state.isAudioPlaying = true;
                    window.StoryReaderUI.updateAudioButtonUI();
                };
                state.activeUtterance.onend = state.activeUtterance.onerror = function () {
                    state.isAudioPlaying = false;
                    state.activeUtterance = null;
                    window.clearStoryKaraokeHighlight();
                    window.StoryReaderUI.updateAudioButtonUI();
                };

                window.attachStoryKaraokeSync(state.activeUtterance, '#storyParagraphText', false, rate);
                window.speechSynthesis.speak(state.activeUtterance);
                state.isAudioPlaying = true;
                window.StoryReaderUI.updateAudioButtonUI();
            } catch (err) {
                state.isAudioPlaying = false;
                window.clearStoryKaraokeHighlight();
                window.StoryReaderUI.updateAudioButtonUI();
            }
        } else if (typeof showDictToast === 'function') {
            showDictToast("Trình duyệt không hỗ trợ phát âm thanh tổng hợp.");
        }
    }
    window.playStoryAudio = playStoryAudio;

    function stopStoryAudio() {
        const state = window.StoryReaderState;
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
        window.clearStoryKaraokeHighlight();
        if (state) {
            state.isAudioPlaying = false;
            state.activeUtterance = null;
        }
        if (window.StoryReaderUI && typeof window.StoryReaderUI.updateAudioButtonUI === 'function') {
            window.StoryReaderUI.updateAudioButtonUI();
        }
    }
    window.stopStoryAudio = stopStoryAudio;

    /**
     * Hoàn thành toàn bộ câu chuyện:
     */
    function completeStoryLesson() {
        const state = window.StoryReaderState;
        stopStoryAudio();

        const flashcardsCreated = [];
        (state.currentStory.parts || []).forEach(part => {
            (part.targetWords || []).forEach(w => {
                if (state.wordClassifications[w.term] === false) {
                    flashcardsCreated.push({
                        term: w.term, ipa: w.phonetic,
                        type: w.pos === 'ADJ' ? 'Tính từ' : w.pos === 'NOUN' ? 'Danh từ' : 'Động từ',
                        meaning: w.meaning, example: w.example, image: part.imageUrl,
                        leitnerLevel: 1, topicId: state.currentStory.id || 'topic_006'
                    });
                }
            });
        });

        if (flashcardsCreated.length > 0) saveFlashcardsToLibraryDeck(flashcardsCreated);
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(2);
        if (typeof confetti === 'function') confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });

        const msg = flashcardsCreated.length > 0
            ? `🎉 Hoàn thành bài đọc! Đã tạo ${flashcardsCreated.length} thẻ Flashcard mới vào Thư viện của bạn! (+50 XP)`
            : `🎉 Chúc mừng bạn đã hoàn thành bài đọc "${state.currentStory.title}"! (+50 XP)`;
        if (typeof showDictToast === 'function') showDictToast(msg);
        if (window.LumiEnergy && typeof window.LumiEnergy.onLessonCompleted === 'function') {
            try { window.LumiEnergy.onLessonCompleted(); } catch (e) {}
        }
        if (typeof simulateCompleteCurrentLesson === 'function') { try { simulateCompleteCurrentLesson(); } catch (e) {} }

        setTimeout(() => {
            window.closeStoryReaderScreen();
            const targetWords = flashcardsCreated.length > 0
                ? flashcardsCreated.map(c => ({
                    word: c.term, ipa: c.ipa, type: c.type, meaningVi: c.meaning, meaning: c.meaning, image: c.image, example: c.example
                }))
                : (state.currentStory.parts || []).flatMap(p => (p.targetWords || []).map(w => ({
                    word: w.term, ipa: w.phonetic,
                    type: w.pos === 'ADJ' ? 'Tính từ' : w.pos === 'NOUN' ? 'Danh từ' : 'Động từ',
                    meaningVi: w.meaning, meaning: w.meaning, image: p.imageUrl, example: w.example
                })));

            if (typeof window.openLessonFlashcardReview === 'function' && targetWords.length > 0) {
                setTimeout(() => {
                    window.openLessonFlashcardReview({
                        title: state.currentStory.title || "Bài đọc truyện", activeVocab: targetWords,
                        image: (state.currentStory.parts && state.currentStory.parts[0]) ? state.currentStory.parts[0].imageUrl : "assets/cards/lumi_rain_coffee_eaves.jpg",
                        openDirectReview: true
                    });
                }, 150);
            }
        }, 1200);
    }
    window.completeStoryLesson = completeStoryLesson;

    function saveFlashcardsToLibraryDeck(newCards) {
        try {
            if (typeof libraryDecks !== 'undefined' && Array.isArray(libraryDecks)) {
                let targetDeck = libraryDecks.find(d => d.deckKey === 'deck-crow-pitcher' || d.topicId === 'topic_006');
                if (!targetDeck) {
                    targetDeck = {
                        deckKey: 'deck-crow-pitcher', title: 'Quạ và Bình Nước', sourceFilter: 'STORY', sourceLabel: 'Truyện',
                        accentColor: '#B8D166', badge: 'MỚI', meta: 'Vừa tạo', latestUpdatedAt: Date.now(),
                        coverUri: 'Cloud_Deploy/cloudflare_worker/admin/story-images/classics/lesson_006_part_01.jpg',
                        topicId: 'topic_006', cards: []
                    };
                    libraryDecks.unshift(targetDeck);
                }
                newCards.forEach(nc => {
                    if (!targetDeck.cards.some(c => c.term.toLowerCase() === nc.term.toLowerCase())) targetDeck.cards.push(nc);
                });
                targetDeck.meta = `${targetDeck.cards.length} thẻ`;
            }
            try { localStorage.setItem('mindcard_created_flashcards', JSON.stringify(flashcardsCreatedList())); } catch (e) {}
        } catch (err) {}
    }

    function flashcardsCreatedList() {
        const state = window.StoryReaderState, list = [];
        (state.currentStory.parts || []).forEach(part => {
            (part.targetWords || []).forEach(w => { if (state.wordClassifications[w.term] === false) list.push(w); });
        });
        return list;
    }

    function setupTouchGestures() {
        const shell = document.getElementById('storyBookShell');
        if (!shell || shell._touchBound) return;
        shell._touchBound = true;
        let ignoreSwipe = false;

        shell.addEventListener('touchstart', (e) => {
            ignoreSwipe = Boolean(e.target && e.target.closest && e.target.closest('#storyParagraphText, #storyWordActionPopup, #storyTargetCardContainer'));
            if (!ignoreSwipe && e.touches && e.touches[0]) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }
        }, { passive: true });

        shell.addEventListener('touchend', (e) => {
            if (ignoreSwipe || !e.changedTouches || !e.changedTouches[0]) return;
            const dx = e.changedTouches[0].clientX - touchStartX, dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                if (dx < 0) window.storyReaderNextPart();
                else window.storyReaderPrevPart();
            }
        }, { passive: true });
    }
    window.setupStoryTouchGestures = setupTouchGestures;

    window.openStorySettingsModal = function () {
        const modal = document.getElementById('modalStorySettings');
        if (!modal) return;
        window.StoryReaderUI.updateStorySettingsUI();
        modal.classList.remove('hidden'); modal.style.display = 'flex';
    };

    window.closeStorySettingsModal = function (e) {
        if (e && e.target !== e.currentTarget && e.currentTarget.id !== 'modalStorySettings') return;
        const modal = document.getElementById('modalStorySettings');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
    };

    window.setStoryAudioSpeed = function (speed) {
        const state = window.StoryReaderState;
        state.settings.audioSpeed = speed;
        window.StoryReaderUI.updateStorySettingsUI();
        if (state.isAudioPlaying) playStoryAudio();
    };

    window.toggleStoryAutoTranslate = function () {
        const state = window.StoryReaderState;
        state.settings.autoTranslate = !state.settings.autoTranslate;
        state.isTranslationVisible = state.settings.autoTranslate;
        window.StoryReaderUI.updateStorySettingsUI(); window.StoryReaderUI.renderStoryUI();
    };

    window.setStoryFontSize = function (multiplier) {
        const state = window.StoryReaderState;
        state.settings.fontSizeMultiplier = multiplier;
        window.StoryReaderUI.updateStorySettingsUI(); window.StoryReaderUI.renderStoryUI();
    };
})();
