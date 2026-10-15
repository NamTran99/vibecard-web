/**
 * ==========================================================================
 * 🎯 STORY TARGET WORD CLASSIFICATION CARD (UI & CONTROLLER)
 * 1:1 Replica from Android Native MainActivityDialogueTargetWord.kt
 * Separated according to SRP (< 350 lines/file rule)
 * ==========================================================================
 */

(function (window) {
    'use strict';

    let lastSlideDir = null, justClassifiedIdx = null;

    function bindTargetCardSwipeAndKeys() {
        const card = document.getElementById('storyTargetMainCard');
        if (card && !card._swipeBound) {
            card._swipeBound = true;
            let startX = 0, startY = 0, tracking = false;

            const onStart = (x, y, target) => {
                if (target && target.closest && target.closest('button')) return;
                startX = x; startY = y; tracking = true;
                card.style.transition = 'none';
            };
            const onMove = (x, y) => {
                if (!tracking) return;
                const dx = x - startX, dy = y - startY;
                if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy) * 1.1) {
                    const clampedX = Math.max(-44, Math.min(44, dx * 0.34));
                    const rot = Math.max(-1.8, Math.min(1.8, dx * 0.014));
                    card.style.transform = `translate3d(${clampedX.toFixed(1)}px, 0, 0) rotate(${rot.toFixed(2)}deg) scale(0.99)`;
                }
            };
            const onEnd = (x, y) => {
                if (!tracking) return;
                tracking = false;
                card.style.transition = '';
                card.style.transform = '';
                const dx = x - startX, dy = y - startY;
                if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy) * 1.15) {
                    window.stepStoryTargetWord(dx < 0 ? 1 : -1);
                }
            };

            card.addEventListener('touchstart', (e) => { if (e.touches && e.touches[0]) onStart(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
            card.addEventListener('touchmove', (e) => { if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
            card.addEventListener('touchend', (e) => { if (e.changedTouches && e.changedTouches[0]) onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }, { passive: true });
            card.addEventListener('touchcancel', () => { tracking = false; card.style.transition = ''; card.style.transform = ''; }, { passive: true });

            card.addEventListener('mousedown', (e) => { if (e.button === 0) onStart(e.clientX, e.clientY, e.target); });
            window.addEventListener('mousemove', (e) => { if (tracking) onMove(e.clientX, e.clientY); });
            window.addEventListener('mouseup', (e) => { if (tracking) onEnd(e.clientX, e.clientY); });
        }

        if (!window._storyTargetKeysBound) {
            window._storyTargetKeysBound = true;
            window.addEventListener('keydown', (e) => {
                const state = window.StoryReaderState;
                if (!state || !state.isTargetCardExpanded) return;
                const screen = document.getElementById('screenStoryReader');
                if (!screen || screen.classList.contains('hidden')) return;
                if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
                if (e.key === 'ArrowLeft') { e.preventDefault(); window.stepStoryTargetWord(-1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); window.stepStoryTargetWord(1); }
                else if (e.key === '1') { e.preventDefault(); window.classifyCurrentWord(true); }
                else if (e.key === '2') { e.preventDefault(); window.classifyCurrentWord(false); }
            });
        }
    }

    function renderTargetWordCard() {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        const container = document.getElementById('storyTargetCardContainer');
        if (!container) return;

        if (words.length === 0 || !state.isTargetCardExpanded) {
            container.classList.add('hidden');
            container.style.display = 'none';
            if (window.StoryReaderUI) {
                window.StoryReaderUI.refreshParagraphHighlights();
                window.StoryReaderUI.updateProgressAndBottomNav();
            }
            if (typeof window.renderStoryAddedCardsUI === 'function') window.renderStoryAddedCardsUI();
            return;
        }
        container.classList.remove('hidden');
        container.style.display = 'block';
        bindTargetCardSwipeAndKeys();

        const compactRow = document.getElementById('storyTargetCompactRow');
        const expandedContent = document.getElementById('storyTargetExpandedContent');
        const summaryBar = document.getElementById('storyTargetSummaryBar');
        const mainCard = document.getElementById('storyTargetMainCard');

        const unclassifiedCount = words.filter(w => state.wordClassifications[w.term] === undefined).length;
        const classifiedCount = words.length - unclassifiedCount;
        const flashcardCount = words.filter(w => state.wordClassifications[w.term] === false).length;
        const allClassified = unclassifiedCount === 0;

        if (compactRow) { compactRow.classList.add('hidden'); compactRow.style.display = 'none'; }
        if (expandedContent) { expandedContent.classList.remove('hidden'); expandedContent.style.display = 'block'; }

        if (mainCard && lastSlideDir) {
            const animClass = lastSlideDir === 'next' ? 'slide-from-right' : 'slide-from-left';
            lastSlideDir = null;
            mainCard.classList.remove('slide-from-right', 'slide-from-left');
            void mainCard.offsetWidth;
            mainCard.classList.add(animClass);
        }

        const headerTitle = document.getElementById('storyTargetHeaderTitle');
        if (headerTitle) {
            headerTitle.innerHTML = `<span>Từ trong đoạn</span><span class="story-target-header-count">${classifiedCount}/${words.length}</span>`;
        }

        const chipsScroll = document.getElementById('storyTargetChipsScroll');
        if (chipsScroll) {
            const popIdx = justClassifiedIdx;
            justClassifiedIdx = null;
            chipsScroll.innerHTML = words.map((item, idx) => {
                const isSelected = idx === state.currentWordIndex;
                const cState = state.wordClassifications[item.term];
                let chipClass = "story-target-chip";
                let badgeHtml = "";

                if (isSelected) chipClass += " active";
                else if (cState === false) chipClass += " status-flashcard";
                else if (cState === true) chipClass += " status-known";
                if (idx === popIdx) chipClass += " chip-classified-pop";

                if (cState === false) badgeHtml = `<span class="story-target-chip-badge">+ Thẻ</span>`;
                else if (cState === true) badgeHtml = `<span class="story-target-chip-badge">✓ Biết</span>`;

                return `
                    <div data-chip-idx="${idx}" onclick="selectTargetWordIndex(${idx})" class="${chipClass}">
                        <span>${item.term.toLowerCase()}</span>
                        ${badgeHtml}
                    </div>
                `;
            }).join('');

            requestAnimationFrame(() => {
                const activeChip = chipsScroll.querySelector(`[data-chip-idx="${state.currentWordIndex}"]`);
                if (activeChip && typeof activeChip.scrollIntoView === 'function') {
                    activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }

        const selectedWord = words[state.currentWordIndex] || words[0];
        if (selectedWord) {
            const posBadge = document.getElementById('storyTargetPosBadge');
            const indexBadge = document.getElementById('storyTargetIndexBadge');
            const termText = document.getElementById('storyTargetTermText');
            const ipaText = document.getElementById('storyTargetIpaText');
            const meaningText = document.getElementById('storyTargetMeaningText');
            const definitionText = document.getElementById('storyTargetDefinitionText');
            const exampleSentence = document.getElementById('storyTargetExampleSentence');
            const exampleTranslation = document.getElementById('storyTargetExampleTranslation');
            const btnKnown = document.getElementById('storyBtnKnown');
            const btnFlashcard = document.getElementById('storyBtnFlashcard');

            if (posBadge) posBadge.textContent = selectedWord.pos || "WORD";
            if (indexBadge) indexBadge.textContent = `${state.currentWordIndex + 1} / ${words.length}`;
            if (termText) termText.textContent = selectedWord.term.charAt(0).toUpperCase() + selectedWord.term.slice(1);
            if (ipaText) ipaText.textContent = selectedWord.phonetic || "";
            if (meaningText) meaningText.textContent = selectedWord.meaning || "";
            if (definitionText) definitionText.textContent = selectedWord.definition || "";

            if (exampleSentence) {
                const escaped = selectedWord.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const reg = new RegExp(`(${escaped})`, 'gi');
                exampleSentence.innerHTML = (selectedWord.example || "").replace(reg, '<b>$1</b>');
            }
            if (exampleTranslation) exampleTranslation.textContent = selectedWord.exampleTr || "";

            const curState = state.wordClassifications[selectedWord.term];
            if (btnKnown) btnKnown.classList.toggle('selected', curState === true);
            if (btnFlashcard) btnFlashcard.classList.toggle('selected', curState === false);
        }

        if (summaryBar) {
            if (allClassified) {
                summaryBar.classList.remove('hidden');
                summaryBar.style.display = 'flex';
                const summaryText = document.getElementById('storyTargetSummaryText');
                if (summaryText) summaryText.textContent = `✓ Đã phân loại xong ${words.length} từ (Lưu ${flashcardCount} thẻ Flashcard)`;
            } else {
                summaryBar.classList.add('hidden');
                summaryBar.style.display = 'none';
            }
        }

        if (window.StoryReaderUI) {
            window.StoryReaderUI.refreshParagraphHighlights();
            window.StoryReaderUI.updateProgressAndBottomNav();
        }
        if (typeof window.renderStoryAddedCardsUI === 'function') window.renderStoryAddedCardsUI();
    }

    if (window.StoryReaderUI) window.StoryReaderUI.renderTargetWordCard = renderTargetWordCard;
    window.renderStoryTargetWordCard = renderTargetWordCard;

    window.toggleStoryTargetCardExpand = function (expand = null) {
        const state = window.StoryReaderState;
        state.isTargetCardExpanded = (expand !== null) ? expand : !state.isTargetCardExpanded;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) { try { SoundEngine.play(1); } catch (e) {} }
        renderTargetWordCard();
    };

    window.stepStoryTargetWord = function (delta) {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        if (words.length <= 1) return;
        const nextIdx = (state.currentWordIndex + delta + words.length) % words.length;
        lastSlideDir = delta > 0 ? 'next' : 'prev';
        window.selectTargetWordIndex(nextIdx);
    };

    window.selectTargetWordIndex = function (idx) {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        if (idx >= 0 && idx < words.length) {
            if (!lastSlideDir && idx !== state.currentWordIndex) lastSlideDir = idx > state.currentWordIndex ? 'next' : 'prev';
            state.currentWordIndex = idx;
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) { try { SoundEngine.play(1); } catch (e) {} }
            renderTargetWordCard();
        }
    };

    window.classifyCurrentWord = function (isKnown) {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        const currentWord = words[state.currentWordIndex];
        if (!currentWord) return;

        state.wordClassifications[currentWord.term] = isKnown;
        justClassifiedIdx = state.currentWordIndex;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) { try { SoundEngine.play(1); } catch (e) {} }

        const activeBtn = document.getElementById(isKnown ? 'storyBtnKnown' : 'storyBtnFlashcard');
        if (activeBtn) {
            activeBtn.classList.add('selected', 'btn-stamp-pop');
            setTimeout(() => activeBtn.classList.remove('btn-stamp-pop'), 200);
        }

        if (!isKnown && typeof window.notifyStoryFlashcardAdded === 'function') window.notifyStoryFlashcardAdded(currentWord.term);
        else if (isKnown && typeof showDictToast === 'function') showDictToast(`✓ Đã đánh dấu "${currentWord.term}" là Đã biết.`);

        const nextUnclassified = words.findIndex((w, i) => i > state.currentWordIndex && state.wordClassifications[w.term] === undefined);
        const anyUnclassified = words.findIndex(w => state.wordClassifications[w.term] === undefined);

        setTimeout(() => {
            if (nextUnclassified >= 0) { lastSlideDir = 'next'; state.currentWordIndex = nextUnclassified; renderTargetWordCard(); }
            else if (anyUnclassified >= 0) { lastSlideDir = 'next'; state.currentWordIndex = anyUnclassified; renderTargetWordCard(); }
            else {
                renderTargetWordCard();
                setTimeout(() => { state.isTargetCardExpanded = false; renderTargetWordCard(); }, 280);
            }
        }, 150);
    };

    window.reopenStoryTargetClassification = function () {
        const state = window.StoryReaderState;
        state.currentWordIndex = 0; state.isTargetCardExpanded = true;
        renderTargetWordCard();
    };

    window.locateCurrentTargetWord = function () {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        const currentWord = words[state.currentWordIndex];
        if (!currentWord || !currentWord.term) return;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) { try { SoundEngine.play(1); } catch (e) {} }

        const encTerm = encodeURIComponent(currentWord.term);
        const paragraphEl = document.getElementById('storyParagraphText');
        if (!paragraphEl) return;
        const targetSpan = paragraphEl.querySelector(`[data-story-term="${encTerm}"]`);
        if (targetSpan) {
            targetSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetSpan.classList.remove('hl-locate-pulse'); void targetSpan.offsetWidth;
            targetSpan.classList.add('hl-locate-pulse');
            setTimeout(() => targetSpan.classList.remove('hl-locate-pulse'), 2100);
        }
    };

    window.speakCurrentTargetWord = function () {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        const currentWord = words[state.currentWordIndex];
        if (!currentWord || !currentWord.term || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(currentWord.term);
            utter.lang = 'en-US'; utter.rate = 0.95; window.speechSynthesis.speak(utter);
            const btn = document.getElementById('storyTargetWordSpeakerBtn');
            if (btn) {
                btn.style.transform = 'scale(1.15)';
                setTimeout(() => { btn.style.transform = 'scale(1)'; }, 400);
            }
        } catch (e) {}
    };

    window.selectTargetWordByTerm = function (encodedTerm) {
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        const term = decodeURIComponent(encodedTerm), state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        const words = (currentPart && currentPart.targetWords) || [];
        const foundIdx = words.findIndex(w => w.term.toLowerCase() === term.toLowerCase());
        if (foundIdx >= 0) state.currentWordIndex = foundIdx;
        state.isTargetCardExpanded = true;
        renderTargetWordCard(); window.speakCurrentTargetWord();
        const cardContainer = document.getElementById('storyTargetCardContainer');
        if (cardContainer) setTimeout(() => cardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
    };
})(window);
