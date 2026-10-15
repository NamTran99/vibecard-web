/**
 * ==========================================================================
 * 🎨 STORY READER UI RENDERER (PARAGRAPH, HIGHLIGHTS, PROGRESS & SETTINGS)
 * Separated according to SRP (< 350 lines/file rule)
 * ==========================================================================
 */

(function (window) {
    'use strict';

    window.StoryReaderUI = {
        renderStoryUI: function () {
            const state = window.StoryReaderState;
            const parts = state.currentStory.parts || [];
            const currentPart = parts[state.currentPartIndex] || parts[0];
            const words = currentPart.targetWords || [];

            const bookHeaderTitle = document.getElementById('storyBookHeaderTitle');
            if (bookHeaderTitle) bookHeaderTitle.textContent = state.currentStory.title || "Story to Card";

            const heroImg = document.getElementById('storyHeroImg');
            const heroPlaceholder = document.getElementById('storyHeroPlaceholder');
            if (heroImg) {
                if (currentPart.imageUrl) {
                    const resolvedUrl = currentPart.imageUrl.replace(
                        /classics\/(lesson_003_part_0[1-4]|lesson_006_part_0[1-5]|lesson_009_part_0[1-3])\.jpg$/,
                        'codex-realistic-parts/$1.webp'
                    );
                    heroImg.onerror = function () { this.onerror = null; this.src = currentPart.imageUrl !== resolvedUrl ? currentPart.imageUrl : 'assets/cards/lumi_farmer_strawhat.jpg'; };
                    heroImg.style.setProperty('--hero-focus', currentPart.imageFocus || 'center 54%');
                    if (heroImg.getAttribute('src') !== resolvedUrl) {
                        heroImg.classList.remove('hero-crossfade');
                        void heroImg.offsetWidth;
                        heroImg.classList.add('hero-crossfade');
                    }
                    heroImg.src = resolvedUrl;
                    heroImg.alt = `Minh họa đoạn ${state.currentPartIndex + 1}`;
                    heroImg.classList.remove('hidden');
                    if (heroPlaceholder) heroPlaceholder.classList.add('hidden');
                } else {
                    heroImg.classList.add('hidden');
                    if (heroPlaceholder) heroPlaceholder.classList.remove('hidden');
                }
            }

            const partTitleText = currentPart.title || `Đoạn ${state.currentPartIndex + 1}`;
            const titleEl = document.getElementById('storyPartTitle');
            if (titleEl) titleEl.textContent = partTitleText;
            const captionText = document.getElementById('storyHeroCaptionText');
            if (captionText) captionText.textContent = `Cảnh ${state.currentPartIndex + 1}/${parts.length || 1} · ${partTitleText}`;

            const textContainer = document.getElementById('storyParagraphText');
            if (textContainer) {
                const rawContent = currentPart.contentEn || currentPart.content || currentPart.contentVi || "";
                textContainer.innerHTML = this.buildHighlightedText(rawContent, words);
                textContainer.style.fontSize = `${17 * state.settings.fontSizeMultiplier}px`;
            }

            const translationBox = document.getElementById('storyTranslationBox');
            const translateBtn = document.getElementById('storyTranslateBtn');
            if (translationBox) {
                translationBox.textContent = currentPart.contentVi || currentPart.translation || "";
                translationBox.style.fontSize = `${15 * state.settings.fontSizeMultiplier}px`;
                const showTrans = state.isTranslationVisible && Boolean(currentPart.contentVi || currentPart.translation);
                translationBox.classList.toggle('hidden', !showTrans);
                translationBox.style.display = showTrans ? 'block' : 'none';
                translationBox.style.opacity = showTrans ? '1' : '0';
                if (translateBtn) translateBtn.classList.toggle('active-trans', showTrans);
            }

            if (state.currentWordIndex >= words.length) state.currentWordIndex = 0;
            this.renderTargetWordCard();
            this.updateProgressAndBottomNav();
            this.updateAudioButtonUI();
        },

        renderTargetWordCard: function () {
            if (typeof window.renderStoryTargetWordCard === 'function') window.renderStoryTargetWordCard();
        },

        refreshParagraphHighlights: function () {
            const state = window.StoryReaderState;
            const parts = state.currentStory.parts || [];
            const currentPart = parts[state.currentPartIndex] || parts[0];
            if (!currentPart) return;
            const words = currentPart.targetWords || [];
            const textContainer = document.getElementById('storyParagraphText');
            if (textContainer) {
                const rawContent = currentPart.contentEn || currentPart.content || currentPart.contentVi || "";
                textContainer.innerHTML = this.buildHighlightedText(rawContent, words);
                if (typeof window.reapplyStoryKaraokeHighlight === 'function') window.reapplyStoryKaraokeHighlight();
            }
        },

        buildHighlightedText: function (rawText, words) {
            if (!rawText) return "";
            const escapeHtml = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

            const state = window.StoryReaderState || {
                wordClassifications: {}, extraVocabularyItems: {}, phraseDraftTokens: [],
                activePopupWord: null, currentPartIndex: 0, currentWordIndex: 0, isTargetCardExpanded: false
            };
            const parts = (state.currentStory && state.currentStory.parts) || [];
            const currentPart = parts[state.currentPartIndex] || parts[0] || {};
            const sentences = (typeof window.getStoryPartSentences === 'function') ? window.getStoryPartSentences(currentPart) : [];

            function getSentenceIndexAt(charPos) {
                for (let i = 0; i < sentences.length; i++) {
                    if (charPos >= sentences[i].start && charPos <= sentences[i].end) return i;
                }
                return 0;
            }

            const wordTokens = [];
            const wordRegex = /[A-Za-zÀ-ỹ]+(?:['’-][A-Za-zÀ-ỹ]+)*/g;
            let m;
            let tokenCounter = 0;
            while ((m = wordRegex.exec(rawText)) !== null) {
                wordTokens.push({
                    index: tokenCounter++,
                    value: m[0],
                    start: m.index,
                    end: m.index + m[0].length,
                    sentenceIdx: getSentenceIndexAt(m.index)
                });
            }
            state.currentPartTokens = wordTokens;

            const draftTokens = state.phraseDraftTokens || [];
            const draftIndexSet = new Set(draftTokens.map(t => t.index));
            let minDraftIdx = Infinity;
            let maxDraftIdx = -Infinity;
            draftTokens.forEach(t => {
                if (t.index < minDraftIdx) minDraftIdx = t.index;
                if (t.index > maxDraftIdx) maxDraftIdx = t.index;
            });

            const activeWordObj = (words || [])[state.currentWordIndex];
            const activeTermLower = (state.isTargetCardExpanded && activeWordObj && activeWordObj.term)
                ? activeWordObj.term.toLowerCase()
                : null;

            const occupied = new Array(rawText.length).fill(false);
            const targetSpans = [];

            const sortedWords = [...(words || [])]
                .filter(w => w && w.term)
                .sort((a, b) => b.term.length - a.term.length);

            sortedWords.forEach(item => {
                const trimmed = item.term.trim(), escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const reg = new RegExp(`${/^[A-Za-z0-9_]/.test(trimmed) ? '\\b' : ''}${escaped}${/[A-Za-z0-9_]$/.test(trimmed) ? '\\b' : ''}`, 'gi');
                let match;
                while ((match = reg.exec(rawText)) !== null) {
                    const s = match.index;
                    const e = s + match[0].length;
                    let isFree = true;
                    for (let k = s; k < e; k++) {
                        if (occupied[k]) { isFree = false; break; }
                    }
                    if (isFree) {
                        for (let k = s; k < e; k++) occupied[k] = true;
                        const spanTokens = wordTokens.filter(t => t.start >= s && t.end <= e);
                        const firstIdx = spanTokens.length ? spanTokens[0].index : 0;
                        const lastIdx = spanTokens.length ? spanTokens[spanTokens.length - 1].index : firstIdx;
                        targetSpans.push({
                            start: s, end: e, text: match[0], item: item,
                            firstTokenIdx: firstIdx, lastTokenIdx: lastIdx,
                            sentenceIdx: getSentenceIndexAt(s)
                        });
                    }
                }
            });

            wordTokens.forEach(token => {
                let isFree = true;
                for (let k = token.start; k < token.end; k++) {
                    if (occupied[k]) { isFree = false; break; }
                }
                if (isFree && token.value.length >= 1) {
                    for (let k = token.start; k < token.end; k++) occupied[k] = true;
                    targetSpans.push({
                        start: token.start, end: token.end, text: token.value,
                        token: token, sentenceIdx: token.sentenceIdx
                    });
                }
            });

            targetSpans.sort((a, b) => a.start - b.start);

            const isSpanInDraft = (sp) => {
                if (!sp || draftTokens.length < 2) return false;
                if (sp.token) return draftIndexSet.has(sp.token.index) || (sp.token.index >= minDraftIdx && sp.token.index <= maxDraftIdx);
                return sp.lastTokenIdx >= minDraftIdx && sp.firstTokenIdx <= maxDraftIdx;
            };

            const hasSpotlight = Boolean(state.activePopupWord || draftTokens.length > 0) && sentences.length > 1;
            const activeSentenceIdx = hasSpotlight
                ? ((draftTokens[0] && draftTokens[0].sentenceIdx != null) ? draftTokens[0].sentenceIdx : (state.activePopupWord ? state.activePopupWord.sentenceIdx : 0))
                : null;
            const sentClass = (sIdx) => sIdx === activeSentenceIdx
                ? `story-sentence-seg is-spotlight${state.isSpeakingPopupSentence ? ' is-speaking-sentence' : ''}`
                : 'story-sentence-seg is-dimmed';

            let html = "", cursor = 0, inDraftGroup = false, openSentenceIdx = null;

            for (let i = 0; i < targetSpans.length; i++) {
                const sp = targetSpans[i], curInDraft = isSpanInDraft(sp);
                if (!curInDraft && inDraftGroup) { html += '</span>'; inDraftGroup = false; }

                if (hasSpotlight && sp.sentenceIdx !== openSentenceIdx) {
                    if (inDraftGroup) { html += '</span>'; inDraftGroup = false; }
                    const gap = sp.start > cursor ? rawText.slice(cursor, sp.start) : "";
                    if (openSentenceIdx !== null) {
                        const mGap = gap.match(/^([^\s]*\s*)(.*)$/) || ["", gap, ""];
                        html += escapeHtml(mGap[1]) + '</span>' + `<span class="${sentClass(sp.sentenceIdx)}" data-sentence-idx="${sp.sentenceIdx}">` + escapeHtml(mGap[2]);
                    } else {
                        html += `<span class="${sentClass(sp.sentenceIdx)}" data-sentence-idx="${sp.sentenceIdx}">` + escapeHtml(gap);
                    }
                    cursor = sp.start;
                    openSentenceIdx = sp.sentenceIdx;
                } else if (sp.start > cursor) {
                    html += escapeHtml(rawText.slice(cursor, sp.start));
                }

                if (curInDraft && !inDraftGroup) { html += '<span class="story-phrase-draft-group">'; inDraftGroup = true; }
                const charAttrs = `data-char-start="${sp.start}" data-char-end="${sp.end}"`;

                if (sp.item) {
                    const encTerm = encodeURIComponent(sp.item.term), encText = encodeURIComponent(sp.text);
                    const cState = state.wordClassifications ? state.wordClassifications[sp.item.term] : undefined;
                    const dialogOpen = Boolean(state.activePopupWord || draftTokens.length > 0);
                    const justStamped = Boolean(state.lastAddedFlashcardTerm && sp.item.term.toLowerCase() === state.lastAddedFlashcardTerm.toLowerCase());
                    if (sp.item.isExtraLookup && !curInDraft) {
                        const savedClick = dialogOpen
                            ? `onStoryWordTap(event, ${sp.firstTokenIdx}, '${encText}', ${sp.sentenceIdx}, false, '')`
                            : `openStorySavedWordActionModal('${encTerm}')`;
                        html += `<span class="story-extra-saved-hl${justStamped ? ' is-just-stamped' : ''}" ${charAttrs} data-token-idx="${sp.firstTokenIdx}" data-story-term="${encTerm}" onclick="${savedClick}" title="Đã lưu vào Flashcard">${escapeHtml(sp.text)}</span>`;
                    } else {
                        let hlClasses = curInDraft ? "story-phrase-draft-token" : "story-target-word-hl";
                        if (!curInDraft) {
                            if (draftTokens.length === 1 && draftTokens[0].index >= sp.firstTokenIdx && draftTokens[0].index <= sp.lastTokenIdx) hlClasses += " pressed-active";
                            else if (activeTermLower && sp.item.term.toLowerCase() === activeTermLower) hlClasses += " hl-active";
                            else if (cState === false) hlClasses += ` hl-flashcard${justStamped ? ' is-just-stamped' : ''}`;
                            else if (cState === true) hlClasses += " hl-known";
                        }
                        const clickHandler = (dialogOpen || curInDraft)
                            ? `onStoryWordTap(event, ${sp.firstTokenIdx}, '${encText}', ${sp.sentenceIdx}, false, '${encTerm}')`
                            : `selectTargetWordByTerm('${encTerm}')`;
                        html += `<span class="${hlClasses}" ${charAttrs} data-token-idx="${sp.firstTokenIdx}" data-story-term="${encTerm}" data-is-target="1" onclick="${clickHandler}">${escapeHtml(sp.text)}</span>`;
                    }
                } else if (sp.token) {
                    const tIdx = sp.token.index, encWord = encodeURIComponent(sp.token.value);
                    let wClasses = "story-any-word";
                    if (draftTokens.length === 1 && draftTokens[0].index === tIdx) wClasses += " pressed-active";
                    else if (curInDraft) wClasses += draftIndexSet.has(tIdx) ? " story-phrase-draft-token" : " story-phrase-gap-token";
                    html += `<span class="${wClasses}" ${charAttrs} data-token-idx="${tIdx}" onclick="onStoryWordTap(event, ${tIdx}, '${encWord}', ${sp.sentenceIdx})">${escapeHtml(sp.text)}</span>`;
                }
                cursor = sp.end;
            }

            if (inDraftGroup) html += '</span>';
            if (cursor < rawText.length) html += escapeHtml(rawText.slice(cursor));
            if (openSentenceIdx !== null) html += '</span>';
            return html;
        },

        updateProgressAndBottomNav: function () {
            const state = window.StoryReaderState;
            const parts = state.currentStory.parts || [];
            const total = parts.length || 1;
            const currentPart = parts[state.currentPartIndex] || parts[0];
            const words = (currentPart && currentPart.targetWords) || [];

            const progressLabel = document.getElementById('storyProgressLabel');
            const progressFill = document.getElementById('storyProgressFill');
            const unclassifiedCount = words.filter(w => state.wordClassifications[w.term] === undefined).length;
            const isPartDone = unclassifiedCount === 0;

            if (progressLabel) {
                progressLabel.textContent = isPartDone
                    ? `ĐOẠN ${state.currentPartIndex + 1} / ${total} ✓`
                    : `ĐOẠN ${state.currentPartIndex + 1} / ${total}`;
                progressLabel.classList.toggle('is-completed', isPartDone);
            }
            if (progressFill) progressFill.style.width = `${((state.currentPartIndex + 1) / total) * 100}%`;

            const bottomNav = document.getElementById('storyBottomNav');
            const prevBtn = document.getElementById('storyNavPrevBtn');
            const nextBtn = document.getElementById('storyNavNextBtn');
            const nextLabel = document.getElementById('storyNavNextLabel');

            if (bottomNav) {
                const hideBottomNav = Boolean(state.isTargetCardExpanded || state.activePopupWord || (state.phraseDraftTokens && state.phraseDraftTokens.length > 0));
                bottomNav.classList.toggle('story-bottom-nav-hidden', hideBottomNav);
            }
            if (prevBtn) {
                const isFirstPart = state.currentPartIndex === 0;
                prevBtn.classList.toggle('hidden', isFirstPart);
                prevBtn.style.display = isFirstPart ? 'none' : 'flex';
            }
            if (nextBtn && nextLabel) {
                const classifiedCount = Math.max(0, words.length - unclassifiedCount);
                const pct = words.length > 0 ? Math.round((classifiedCount / words.length) * 100) : 100;
                nextBtn.style.setProperty('--nav-progress', `${pct}%`);
                if (unclassifiedCount > 0) {
                    nextLabel.textContent = classifiedCount > 0
                        ? `Đã xong ${classifiedCount}/${words.length} • Học nốt ${unclassifiedCount} từ 🔒`
                        : `Học nốt ${unclassifiedCount}/${words.length} từ 🔒`;
                    nextBtn.classList.add('btn-locked');
                    nextBtn.classList.remove('btn-ready', 'completed-btn');
                } else {
                    nextBtn.classList.remove('btn-locked');
                    nextBtn.classList.add('btn-ready');
                    nextLabel.textContent = (state.currentPartIndex === total - 1) ? "Hoàn thành bài đọc ✨" : `Đoạn tiếp theo (${words.length}/${words.length} ✓) ›`;
                    nextBtn.classList.toggle('completed-btn', state.currentPartIndex === total - 1);
                }
            }
        },

        updateStorySettingsUI: function () {
            const s = window.StoryReaderState.settings;
            [['storySettingSpeed075', 0.75], ['storySettingSpeed100', 1.0], ['storySettingSpeed125', 1.25]].forEach(([id, v]) => {
                const el = document.getElementById(id); if (el) el.classList.toggle('active', s.audioSpeed === v);
            });
            const transToggle = document.getElementById('storySettingTransToggle');
            if (transToggle) {
                transToggle.textContent = s.autoTranslate ? "Bật" : "Tắt";
                transToggle.className = `story-toggle-btn ${s.autoTranslate ? 'active' : 'inactive'}`;
            }
            [['storySettingFontSmall', 0.85], ['storySettingFontMedium', 1.0], ['storySettingFontLarge', 1.15]].forEach(([id, v]) => {
                const el = document.getElementById(id); if (el) el.classList.toggle('active', s.fontSizeMultiplier === v);
            });
        },

        updateAudioButtonUI: function () {
            const isPlaying = Boolean(window.StoryReaderState.isAudioPlaying);
            const audioBtn = document.getElementById('storySpeakerBtn');
            if (audioBtn) audioBtn.classList.toggle('audio-playing', isPlaying);
            const heroFrame = document.getElementById('storyHeroFrame');
            if (heroFrame) heroFrame.classList.toggle('ken-burns-active', isPlaying);
        }
    };
})(window);
