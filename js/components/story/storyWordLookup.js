/** 🔍 STORY WORD TAP POPUP, ANDROID FINGER LOUPE & PHRASE SELECTION CONTROLLER */
(function (window) {
    'use strict';
    let swipeState = null, suppressClickUntil = 0, warnHintTimer = null;
    const playTick = (id = 1) => { if (typeof SoundEngine !== 'undefined' && SoundEngine.play) { try { SoundEngine.play(id); } catch (e) {} } };

    window.getStoryPartSentences = function (part) {
        if (!part) return [];
        const rawEn = (part.contentEn || part.content || "").trim(), rawVi = (part.contentVi || part.translation || "").trim();
        if (!rawEn) return [];
        const enS = rawEn.split(/(?<=[.!?])\s+/).filter(Boolean), viS = rawVi.split(/(?<=[.!?])\s+/).filter(Boolean);
        let cur = 0;
        return enS.map((enText, idx) => { const start = rawEn.indexOf(enText, cur), end = start >= 0 ? start + enText.length : rawEn.length; if (start >= 0) cur = end; return { index: idx, text: enText, translation: viS[idx] || rawVi || "", start: start >= 0 ? start : 0, end }; });
    };

    function buildContiguousTokenRange(startIdx, endIdx, targetSentenceIdx) {
        const all = (window.StoryReaderState && window.StoryReaderState.currentPartTokens) || [], lo = Math.min(startIdx, endIdx), hi = Math.max(startIdx, endIdx), res = [];
        for (let i = lo; i <= hi; i++) { const t = all[i]; if (t && (targetSentenceIdx == null || t.sentenceIdx === targetSentenceIdx)) res.push({ index: t.index, value: t.value, start: t.start, end: t.end, sentenceIdx: t.sentenceIdx != null ? t.sentenceIdx : targetSentenceIdx }); }
        return res;
    }

    const expandTappedSpanIndices = (tokenIndex, word) => ({ first: tokenIndex, last: tokenIndex + Math.max(0, (word || "").trim().split(/\s+/).filter(Boolean).length - 1) });
    const clearAimHighlights = () => document.querySelectorAll('#storyParagraphText .finger-aim-active').forEach(el => el.classList.remove('finger-aim-active'));

    function findNearestTokenSpan(x, y, maxDist = 22) {
        const direct = document.elementFromPoint ? document.elementFromPoint(x, y) : null, hit = direct && direct.closest ? direct.closest('#storyParagraphText [data-token-idx]') : null;
        if (hit) return hit;
        let best = null, minD = maxDist;
        document.querySelectorAll('#storyParagraphText [data-token-idx]').forEach(sp => { const r = sp.getBoundingClientRect(), d = Math.hypot(x < r.left ? (r.left - x) : (x > r.right ? (x - r.right) : 0), y < r.top ? (r.top - y) : (y > r.bottom ? (y - r.bottom) : 0)); if (d < minD) { minD = d; best = sp; } });
        return best;
    }

    function updateFingerLoupe(clientX, clientY, text, subText, badgeText, isPhraseMode) {
        const loupe = document.getElementById('storyFingerWordLoupe'), screen = document.getElementById('screenStoryReader');
        if (!loupe || !screen) return;
        const tEl = document.getElementById('storyFingerLoupeText'), sEl = document.getElementById('storyFingerLoupeSub'), bEl = document.getElementById('storyFingerLoupeBadge');
        const wordChanged = tEl && tEl.textContent && tEl.textContent !== (text || "") && !loupe.classList.contains('hidden');
        if (tEl) tEl.textContent = text || "";
        if (sEl) { sEl.textContent = subText || ""; sEl.style.display = subText ? 'block' : 'none'; }
        if (bEl) { bEl.textContent = badgeText || ""; bEl.classList.toggle('hidden', !badgeText); }
        loupe.classList.toggle('is-phrase-mode', Boolean(isPhraseMode)); loupe.classList.remove('hidden'); loupe.style.display = 'flex';
        if (wordChanged) { loupe.classList.remove('loupe-word-hop'); void loupe.offsetWidth; loupe.classList.add('loupe-word-hop'); }
        const sr = screen.getBoundingClientRect(), w = loupe.offsetWidth || 130;
        loupe.style.left = `${Math.round(Math.max(w / 2 + 10, Math.min(sr.width - w / 2 - 10, clientX - sr.left)))}px`;
        loupe.style.top = `${Math.round(Math.max(58, (clientY - sr.top) - 46))}px`;
    }

    function hideFingerLoupe() { clearAimHighlights(); const l = document.getElementById('storyFingerWordLoupe'); if (l) { l.classList.add('hidden'); l.classList.remove('is-phrase-mode', 'loupe-word-hop'); l.style.display = 'none'; } }
    function setSwipeVisualClasses(active) { const p = document.getElementById('storyWordActionPopup'), pEl = document.getElementById('storyParagraphText'); if (p) p.classList.toggle('is-swiping-phrase', active); if (pEl) pEl.classList.toggle('is-swiping-phrase', active); }

    function triggerPopupBoundaryWarning(reason, word, spanEl, tokenIndex, sentenceIdx, encTargetTerm) {
        const popup = document.getElementById('storyWordActionPopup'), hintEl = document.getElementById('storyActionPopupHint');
        if (!popup) return;
        const closeBtn = popup.querySelector('.story-action-popup-close');
        popup.classList.remove('is-warn-shake'); void popup.offsetWidth; popup.classList.add('is-warn-shake');
        if (closeBtn) { closeBtn.classList.remove('is-nudge-pulse'); void closeBtn.offsetWidth; closeBtn.classList.add('is-nudge-pulse'); }
        playTick(8);
        if (!hintEl) return;
        const encTarget = encTargetTerm || (spanEl && spanEl.getAttribute && spanEl.getAttribute('data-is-target') === '1' ? (spanEl.getAttribute('data-story-term') || '') : '');
        const prefix = '⚠️ Khác câu đang tra · Đóng ✕ hoặc ';
        hintEl.innerHTML = encTarget ? `${prefix}<button type="button" class="story-popup-hint-link" onclick="switchPopupToTargetWord('${encTarget}')">Xem mục tiêu «${decodeURIComponent(encTarget)}» ↵</button>` : `${prefix}<button type="button" class="story-popup-hint-link" onclick="switchPopupToNewWord(${tokenIndex || 0},'${encodeURIComponent(word || '')}',${sentenceIdx || 0})">Tra câu này «${word || ''}» ↵</button>`;
        hintEl.classList.remove('is-target-merged-banner'); hintEl.classList.add('is-warn-banner');
        if (warnHintTimer) clearTimeout(warnHintTimer);
        warnHintTimer = setTimeout(() => { hintEl.classList.remove('is-warn-banner'); const act = window.StoryReaderState && window.StoryReaderState.activePopupWord; if (act) hintEl.textContent = act.isPhrase ? "✨ Kéo/chạm trong câu để tra cụm hoặc cả câu • Đóng ✕ để tra mới" : "💡 Kéo/chạm tiếp trong câu để tra cụm hoặc cả câu • Đóng ✕ để tra mới"; }, 3600);
    }

    window.switchPopupToTargetWord = (encTerm) => { window.dismissStoryWordActionPopup(); if (typeof window.selectTargetWordByTerm === 'function') window.selectTargetWordByTerm(encTerm); };
    window.switchPopupToNewWord = (tokenIndex, encWord, sentenceIdx) => { window.dismissStoryWordActionPopup(); window.onStoryWordTap(null, tokenIndex, encWord, sentenceIdx, true); };

    function applyPhraseBridgePreview(anchorFirst, anchorLast, targetBounds, sentenceIdx, clientX, clientY, fallbackWord) {
        const all = (window.StoryReaderState && window.StoryReaderState.currentPartTokens) || [], tSent = all[targetBounds.first] ? all[targetBounds.first].sentenceIdx : sentenceIdx;
        const crossedSentence = (sentenceIdx != null && tSent != null && tSent !== sentenceIdx), lo = Math.min(anchorFirst, targetBounds.first), hi = Math.max(anchorLast, targetBounds.last);
        if (crossedSentence && (!swipeState || !swipeState.isSwiping)) {
            if (swipeState) { swipeState.blockedReason = 'cross_sentence'; swipeState.targetSentenceIdx = tSent; }
            updateFingerLoupe(clientX, clientY, fallbackWord, "⚠️ Khác câu • Đóng ✕ để tra câu khác", "🔒", false); return false;
        }
        const bridged = buildContiguousTokenRange(lo, hi, sentenceIdx);
        if (bridged.length > 0 && window.StoryReaderState) {
            if (swipeState) swipeState.blockedReason = null;
            window.StoryReaderState.phraseDraftTokens = bridged;
            if (window.StoryReaderUI) window.StoryReaderUI.refreshParagraphHighlights();
            const isTargetSpan = swipeState && swipeState.lastSpan && swipeState.lastSpan.getAttribute('data-is-target') === '1';
            const shownWord = crossedSentence ? (targetBounds.first > anchorLast ? bridged[bridged.length - 1].value : bridged[0].value) : fallbackWord;
            updateFingerLoupe(clientX, clientY, shownWord, crossedSentence ? "Đã chọn tới cuối câu • Thả ra để tra" : (isTargetSpan ? "Từ mục tiêu • Thả ra để gộp tra câu/cụm" : `Đang chọn ${bridged.length} từ • Thả ra để tra`), "", true);
            return true;
        }
        if (swipeState) { swipeState.blockedReason = 'cross_sentence'; swipeState.targetSentenceIdx = tSent; }
        updateFingerLoupe(clientX, clientY, fallbackWord, "⚠️ Khác câu • Đóng ✕ để tra câu khác", "🔒", false); return false;
    }

    function initStoryPhraseSwipeGestures() {
        document.addEventListener('contextmenu', e => { if (e.target && e.target.closest && e.target.closest('#storyParagraphText')) e.preventDefault(); });
        document.addEventListener('pointerdown', (e) => {
            if ((e.pointerType === 'mouse' && e.button !== 0) || !e.target || !e.target.closest || !e.target.closest('#storyParagraphText')) return;
            const sp = findNearestTokenSpan(e.clientX, e.clientY, 18);
            if (!sp) return;
            const tappedIdx = Number(sp.getAttribute('data-token-idx')), wordText = (sp.textContent || "").trim(), bounds = expandTappedSpanIndices(tappedIdx, wordText);
            const state = window.StoryReaderState || {}, allTokens = state.currentPartTokens || [], draft = (state.phraseDraftTokens || []).slice().sort((a, b) => a.index - b.index);
            const dialogOpen = Boolean(state.activePopupWord && draft.length >= 1), tappedSentIdx = (allTokens[tappedIdx] && allTokens[tappedIdx].sentenceIdx) || 0;
            let anchorFirst = bounds.first, anchorLast = bounds.last, sIdx = tappedSentIdx;
            if (dialogOpen) {
                const dMin = draft[0].index, dMax = draft[draft.length - 1].index;
                sIdx = draft[0].sentenceIdx != null ? draft[0].sentenceIdx : sIdx;
                if (draft.length === 1) { anchorFirst = dMin; anchorLast = dMax; }
                else anchorFirst = anchorLast = (Math.abs(bounds.first - dMax) <= Math.abs(bounds.first - dMin)) ? dMin : dMax;
            }
            swipeState = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, downAt: Date.now(), anchorFirst, anchorLast, lastFirst: bounds.first, lastLast: bounds.last, lastSpan: sp, lastWord: wordText, sentenceIdx: sIdx, targetSentenceIdx: tappedSentIdx, isSwiping: false, isPhraseMode: dialogOpen, blockedReason: null };
            clearAimHighlights();
            if (dialogOpen) { setSwipeVisualClasses(true); playTick(); applyPhraseBridgePreview(anchorFirst, anchorLast, bounds, sIdx, e.clientX, e.clientY, wordText); }
            else { sp.classList.add('finger-aim-active'); updateFingerLoupe(e.clientX, e.clientY, wordText, "Thả ra để tra từ", "", false); }
        });

        window.addEventListener('pointermove', (e) => {
            if (!swipeState || e.pointerId !== swipeState.pointerId) return;
            const dx = e.clientX - swipeState.startX, dy = e.clientY - swipeState.startY;
            if (!swipeState.isSwiping && !swipeState.isPhraseMode && Math.abs(dy) > 22 && Math.abs(dy) > Math.abs(dx) * 1.4) { swipeState = null; hideFingerLoupe(); return; }
            const sp = findNearestTokenSpan(e.clientX, e.clientY, 24);
            if (!sp) return;
            const wordText = (sp.textContent || "").trim(), b = expandTappedSpanIndices(Number(sp.getAttribute('data-token-idx')), wordText);
            if (!swipeState.isSwiping) {
                if (b.first === swipeState.lastFirst && b.last === swipeState.lastLast) {
                    if (swipeState.isPhraseMode) applyPhraseBridgePreview(swipeState.anchorFirst, swipeState.anchorLast, b, swipeState.sentenceIdx, e.clientX, e.clientY, wordText);
                    else updateFingerLoupe(e.clientX, e.clientY, wordText, "Thả ra để tra từ", "", false);
                    return;
                }
                swipeState.isSwiping = true; setSwipeVisualClasses(true);
            }
            if (e.cancelable) e.preventDefault();
            const movedToken = (b.first !== swipeState.lastFirst || b.last !== swipeState.lastLast);
            if (movedToken) { swipeState.lastFirst = b.first; swipeState.lastLast = b.last; swipeState.lastSpan = sp; swipeState.lastWord = wordText; playTick(); }
            if (!swipeState.isPhraseMode) {
                if (movedToken) { clearAimHighlights(); sp.classList.add('finger-aim-active'); }
                updateFingerLoupe(e.clientX, e.clientY, wordText, "Thả ra để tra từ", "", false); return;
            }
            applyPhraseBridgePreview(swipeState.anchorFirst, swipeState.anchorLast, b, swipeState.sentenceIdx, e.clientX, e.clientY, wordText);
        }, { passive: false });

        const finishSwipe = (e) => {
            if (!swipeState || (e && e.pointerId != null && e.pointerId !== swipeState.pointerId)) return;
            const st = swipeState, heldMs = Date.now() - st.downAt;
            swipeState = null; setSwipeVisualClasses(false); hideFingerLoupe();
            if (e && e.type === 'pointercancel') return;
            if (st.isPhraseMode) {
                suppressClickUntil = Date.now() + 340;
                if (st.blockedReason) { triggerPopupBoundaryWarning(st.blockedReason, st.lastWord, st.lastSpan, st.lastFirst, st.targetSentenceIdx); return; }
                syncPopupWithDraftTokens(st.lastSpan, (st.lastSpan && st.lastSpan.getAttribute('data-is-target') === '1') ? decodeURIComponent(st.lastSpan.getAttribute('data-story-term') || '') : ''); return;
            }
            if ((st.isSwiping || heldMs >= 160) && st.lastSpan) {
                suppressClickUntil = Date.now() + 340;
                const allTokens = (window.StoryReaderState && window.StoryReaderState.currentPartTokens) || [], sIdx = (allTokens[st.lastFirst] && allTokens[st.lastFirst].sentenceIdx) || st.sentenceIdx || 0;
                const initial = buildContiguousTokenRange(st.lastFirst, st.lastLast, sIdx);
                if (window.StoryReaderState) window.StoryReaderState.phraseDraftTokens = initial.length > 0 ? initial : [{ index: st.lastFirst, value: st.lastWord, sentenceIdx: sIdx }];
                playTick(); syncPopupWithDraftTokens(st.lastSpan);
            }
        };
        window.addEventListener('pointerup', finishSwipe); window.addEventListener('pointercancel', finishSwipe);
        document.addEventListener('click', e => { if (Date.now() < suppressClickUntil && e.target && e.target.closest && e.target.closest('#storyBookShell')) { e.stopPropagation(); e.preventDefault(); } }, true);
    }
    initStoryPhraseSwipeGestures();

    window.onStoryParagraphContainerClick = function (event) {
        if (Date.now() < suppressClickUntil) { if (event) event.stopPropagation(); return; }
        const state = window.StoryReaderState;
        if (!state || !state.activePopupWord || !event || !event.clientX || !event.clientY) return;
        event.stopPropagation();
        const bestSpan = findNearestTokenSpan(event.clientX, event.clientY, 22);
        if (bestSpan && bestSpan !== event.target) bestSpan.click();
    };

    window.onStoryWordTap = function (event, tokenIndex, encodedWord, sentenceIdx, fromPhraseStrip, encTargetTerm) {
        if (event) event.stopPropagation();
        if (Date.now() < suppressClickUntil && !fromPhraseStrip) return;
        const word = decodeURIComponent(encodedWord).trim();
        if (!word) return;
        const state = window.StoryReaderState, draft = (state.phraseDraftTokens || []).slice().sort((a, b) => a.index - b.index), spanRange = expandTappedSpanIndices(tokenIndex, word);
        const curEl = event ? event.currentTarget : null;
        const resolvedEncTarget = encTargetTerm || (curEl && curEl.getAttribute && curEl.getAttribute('data-is-target') === '1' ? (curEl.getAttribute('data-story-term') || '') : '');
        if (draft.length > 0 && state.activePopupWord) {
            const minIdx = draft[0].index, maxIdx = draft[draft.length - 1].index, activeSentenceIdx = draft[0].sentenceIdx;
            if (draft.length === 1 && minIdx === tokenIndex && spanRange.last === minIdx) { window.dismissStoryWordActionPopup(); return; }
            if (draft.length > 1 && tokenIndex >= minIdx && tokenIndex <= maxIdx) {
                state.phraseDraftTokens = (tokenIndex === minIdx) ? draft.filter(t => t.index > spanRange.last) : ((spanRange.last >= maxIdx) ? draft.filter(t => t.index < tokenIndex) : (((tokenIndex - minIdx) >= (maxIdx - tokenIndex)) ? draft.filter(t => t.index <= spanRange.last) : draft.filter(t => t.index >= tokenIndex)));
                playTick(); syncPopupWithDraftTokens(null); return;
            }
            if (sentenceIdx != null && activeSentenceIdx != null && sentenceIdx !== activeSentenceIdx) { triggerPopupBoundaryWarning('cross_sentence', word, curEl, tokenIndex, sentenceIdx, resolvedEncTarget); return; }
            const bridged = buildContiguousTokenRange(Math.min(minIdx, spanRange.first), Math.max(maxIdx, spanRange.last), activeSentenceIdx);
            if (bridged.length > 0) { state.phraseDraftTokens = bridged; playTick(); syncPopupWithDraftTokens(curEl, resolvedEncTarget ? decodeURIComponent(resolvedEncTarget) : ''); return; }
        }
        const saved = findSavedExtraItemForToken(tokenIndex, word);
        if (saved) { window.dismissStoryWordActionPopup(); window.openStorySavedWordActionModal(encodeURIComponent(saved.term)); return; }
        const initial = buildContiguousTokenRange(spanRange.first, spanRange.last, sentenceIdx || 0);
        state.phraseDraftTokens = initial.length > 0 ? initial : [{ index: tokenIndex, value: word, sentenceIdx: sentenceIdx || 0 }];
        playTick(); syncPopupWithDraftTokens(curEl);
    };

    window.selectEntireStorySentenceFromPopup = function () {
        const state = window.StoryReaderState, draft = (state && state.phraseDraftTokens) || [];
        if (!draft.length) return;
        const sIdx = draft[0].sentenceIdx || 0, sentTokens = (state.currentPartTokens || []).filter(t => t.sentenceIdx === sIdx);
        if (sentTokens.length > 0) { state.phraseDraftTokens = sentTokens.map(t => ({ index: t.index, value: t.value, start: t.start, end: t.end, sentenceIdx: sIdx })); playTick(); syncPopupWithDraftTokens(null); }
    };

    function syncPopupWithDraftTokens(targetEl, bridgedTargetTerm) {
        const state = window.StoryReaderState, draft = (state.phraseDraftTokens || []).slice().sort((a, b) => a.index - b.index);
        if (draft.length === 0) { window.dismissStoryWordActionPopup(); return; }
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex] || {}, sentences = window.getStoryPartSentences(currentPart), sIdx = draft[0].sentenceIdx || 0;
        const matched = sentences[sIdx] || sentences[0] || { text: currentPart.contentEn || "", translation: currentPart.contentVi || "" };
        const rawContent = currentPart.contentEn || currentPart.content || "", firstTok = draft[0], lastTok = draft[draft.length - 1];
        const combinedTerm = (draft.length > 1 && firstTok.start != null && lastTok.end != null && rawContent) ? rawContent.slice(firstTok.start, lastTok.end).trim() : draft.map(t => t.value).join(' ').trim();
        const isPhrase = draft.length >= 2, sentTokens = (state.currentPartTokens || []).filter(t => t.sentenceIdx === sIdx), isFullSentence = sentTokens.length > 1 && draft.length >= sentTokens.length;
        const resolved = (typeof window.resolveStoryLexiconEntry === 'function') ? window.resolveStoryLexiconEntry(combinedTerm, matched.text, matched.translation) : { ipa: "", pos: "TỪ VỰNG", meaning: `Nghĩa của "${combinedTerm}"`, needsLiveTranslate: true };
        const useSentenceVi = Boolean(isFullSentence && matched.translation && matched.translation.trim());
        const cleanIpa = (!isPhrase && resolved.ipa && resolved.ipa !== "/.../") ? resolved.ipa : "";
        state.activePopupWord = { tokenIndex: draft[0].index, tokenIndices: draft.map(t => t.index), word: combinedTerm, isPhrase, isFullSentence, wordCount: draft.length, ipa: cleanIpa, pos: isFullSentence ? "CÂU TRUYỆN" : (isPhrase ? "CỤM / CÂU" : (resolved.pos || "TỪ VỰNG")), meaning: useSentenceVi ? matched.translation.trim() : ((resolved.needsLiveTranslate && isPhrase) ? "Đang dịch..." : (resolved.meaning || "")), needsLiveTranslate: useSentenceVi ? false : Boolean(resolved.needsLiveTranslate), sentenceIdx: sIdx, sentenceEn: matched.text, sentenceVi: matched.translation };
        window.StoryReaderUI.refreshParagraphHighlights(); renderPopupWordStrip(draft, sentTokens);
        showStoryWordActionPopupAtElement(targetEl, state.activePopupWord, bridgedTargetTerm);
        if (state.activePopupWord.needsLiveTranslate) enrichPopupWordLive(state.activePopupWord);
    }

    function renderPopupWordStrip(draft, sentTokens) {
        const stripEl = document.getElementById('storyActionPopupWordStrip'), allTokens = (window.StoryReaderState && window.StoryReaderState.currentPartTokens) || [];
        if (!stripEl || !draft || !draft.length || !allTokens.length) { if (stripEl) stripEl.innerHTML = ""; return; }
        const minIdx = draft[0].index, maxIdx = draft[draft.length - 1].index, sIdx = draft[0].sentenceIdx, tokens = sentTokens || allTokens.filter(t => t.sentenceIdx === sIdx);
        const chips = tokens.map(t => `<button type="button" onclick="onStoryWordTap(event, ${t.index}, '${encodeURIComponent(t.value)}', ${t.sentenceIdx}, true)" class="story-strip-chip ${(t.index >= minIdx && t.index <= maxIdx) ? 'in-phrase' : ''}">${(t.index >= minIdx && t.index <= maxIdx) ? '' : '<span class="strip-plus">+</span>'}${t.value}</button>`);
        if (tokens.length > 1 && draft.length < tokens.length) chips.push(`<button type="button" onclick="selectEntireStorySentenceFromPopup()" class="story-strip-chip is-select-all-chip">Chọn cả câu (${tokens.length})</button>`);
        stripEl.innerHTML = chips.join('');
    }

    async function enrichPopupWordLive(popupItem) {
        if (!popupItem || !popupItem.word) return;
        const targetWord = popupItem.word.trim(), cleanLower = targetWord.toLowerCase();
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(targetWord)}`);
            if (res.ok) {
                const data = await res.json(), tr = (data && data[0]) ? data[0].map(seg => (seg && seg[0]) || "").join('').trim() : "";
                if (tr) {
                    popupItem.meaning = tr.charAt(0).toUpperCase() + tr.slice(1);
                    const state = window.StoryReaderState, mEl = document.getElementById('storyActionPopupMeaning');
                    if (state && state.activePopupWord && state.activePopupWord.word === popupItem.word && mEl) mEl.textContent = popupItem.meaning;
                }
            }
        } catch (e) {}
        if (!cleanLower.includes(' ')) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanLower)}`).then(r => r.ok ? r.json() : null).then(arr => {
                const entry = Array.isArray(arr) ? arr[0] : null, ph = entry && (entry.phonetic || ((entry.phonetics || []).find(p => p.text) || {}).text);
                if (!ph) return;
                popupItem.ipa = ph;
                const state = window.StoryReaderState, iEl = document.getElementById('storyActionPopupIpa');
                if (state && state.activePopupWord && state.activePopupWord.word === popupItem.word && !state.activePopupWord.isPhrase && iEl) { iEl.textContent = ph; iEl.style.display = 'inline'; }
            }).catch(() => {});
        }
    }

    function findSavedExtraItemForToken(tokenIndex, word) {
        const state = window.StoryReaderState, map = state && state.extraVocabularyItems;
        if (!map) return null;
        if (map[word.toLowerCase()]) return map[word.toLowerCase()];
        for (const k of Object.keys(map)) { const it = map[k]; if (it && it.tokenIndices && it.partIndex === state.currentPartIndex && it.tokenIndices.indexOf(tokenIndex) >= 0) return it; }
        return null;
    }

    function showStoryWordActionPopupAtElement(targetEl, popupData, bridgedTargetTerm) {
        const popup = document.getElementById('storyWordActionPopup'), screen = document.getElementById('screenStoryReader');
        if (!popup || !screen) return;
        if (warnHintTimer) { clearTimeout(warnHintTimer); warnHintTimer = null; }
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const wordEl = document.getElementById('storyActionPopupWord');
        if (wordEl) { wordEl.textContent = popupData.word; wordEl.classList.toggle('is-long-selection', Boolean(popupData.wordCount >= 6)); }
        const hasRealIpa = !popupData.isPhrase && Boolean(popupData.ipa && popupData.ipa !== "/.../");
        setEl('storyActionPopupIpa', hasRealIpa ? popupData.ipa : "");
        setEl('storyActionPopupMeaning', popupData.meaning || ""); setEl('storyActionBtnSave', "+ Lưu thẻ");
        const hintEl = document.getElementById('storyActionPopupHint'), ipaEl = document.getElementById('storyActionPopupIpa'), resetBtn = document.getElementById('storyActionBtnReset');
        if (hintEl) {
            hintEl.classList.remove('is-warn-banner', 'is-target-merged-banner');
            if (bridgedTargetTerm && popupData.isPhrase) { hintEl.classList.add('is-target-merged-banner'); hintEl.innerHTML = `🔗 Đã nối từ mục tiêu <b>«${bridgedTargetTerm}»</b> · <button type="button" class="story-popup-hint-link" onclick="switchPopupToTargetWord('${encodeURIComponent(bridgedTargetTerm)}')">Mở thẻ mục tiêu ↵</button>`; }
            else hintEl.textContent = popupData.isPhrase ? "✨ Kéo/chạm trong câu để tra cụm hoặc cả câu • Đóng ✕ để tra mới" : "💡 Kéo/chạm tiếp trong câu để tra cụm hoặc cả câu • Đóng ✕ để tra mới";
        }
        if (ipaEl) { ipaEl.classList.remove('is-phrase-badge'); ipaEl.style.display = hasRealIpa ? 'inline' : 'none'; }
        if (resetBtn) { resetBtn.classList.toggle('hidden', !popupData.isPhrase); resetBtn.style.display = popupData.isPhrase ? 'inline-flex' : 'none'; }
        const transEl = document.getElementById('storyActionPopupSentenceVi'), dividerEl = document.getElementById('storyActionPopupDivider'), sentRow = document.getElementById('storyActionPopupSentenceRow');
        if (transEl) {
            transEl.textContent = popupData.sentenceVi || "";
            const hasCtx = !popupData.isFullSentence && Boolean((popupData.sentenceVi && popupData.sentenceVi.trim()) || (popupData.sentenceEn && popupData.sentenceEn.trim()));
            if (sentRow) sentRow.style.display = hasCtx ? 'flex' : 'none';
            if (dividerEl) dividerEl.style.display = hasCtx ? 'block' : 'none';
        }
        const draftBar = document.getElementById('storyPhraseDraftBar');
        if (draftBar) { draftBar.classList.add('hidden'); draftBar.style.display = 'none'; }
        popup.classList.remove('hidden', 'is-swiping-phrase', 'is-warn-shake'); popup.style.display = 'block';
        const sr = screen.getBoundingClientRect(), popupWidth = Math.min(332, sr.width - 20);
        const liveAnchor = document.querySelector('#storyParagraphText .story-phrase-draft-group') || document.querySelector(`#storyParagraphText [data-token-idx="${popupData.tokenIndex}"]`) || (targetEl && targetEl.isConnected ? targetEl : null);
        const tr = liveAnchor ? liveAnchor.getBoundingClientRect() : null;
        popup.style.width = `${popupWidth}px`;
        const ph = popup.offsetHeight || 225, maxB = sr.height - 84;
        const left = (tr && tr.width > 0) ? Math.max(10, Math.min(sr.width - popupWidth - 10, (tr.left - sr.left) + (tr.width / 2) - popupWidth / 2)) : (sr.width - popupWidth) / 2;
        const top = (tr && tr.width > 0) ? (((tr.bottom - sr.top) + 8 + ph > maxB) ? (((tr.top - sr.top) - ph - 8 >= 64) ? ((tr.top - sr.top) - ph - 8) : Math.max(64, maxB - ph)) : ((tr.bottom - sr.top) + 8)) : 220;
        popup.style.left = `${Math.round(left)}px`; popup.style.top = `${Math.round(top)}px`;
        if (window.StoryReaderUI && typeof window.StoryReaderUI.updateProgressAndBottomNav === 'function') window.StoryReaderUI.updateProgressAndBottomNav();
    }

    function setSentenceSpeakVisual(playing) {
        if (window.StoryReaderState) window.StoryReaderState.isSpeakingPopupSentence = playing;
        if (!playing && typeof window.clearStoryKaraokeHighlight === 'function') window.clearStoryKaraokeHighlight();
        const spot = document.querySelector('#storyParagraphText .story-sentence-seg.is-spotlight');
        if (spot) spot.classList.toggle('is-speaking-sentence', playing);
    }

    window.resetStoryPhraseToSingleWord = () => { const s = window.StoryReaderState, d = s && s.phraseDraftTokens; if (d && d.length) { s.phraseDraftTokens = [d[0]]; syncPopupWithDraftTokens(null); } };
    window.speakStoryPopupWord = () => { const a = window.StoryReaderState && window.StoryReaderState.activePopupWord; if (!a || !a.word || !('speechSynthesis' in window)) return; try { setSentenceSpeakVisual(false); window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(a.word); u.lang = 'en-US'; u.rate = 0.95; window.speechSynthesis.speak(u); } catch (e) {} };
    window.quickSaveWordFromPopup = () => {
        const state = window.StoryReaderState, active = state && state.activePopupWord;
        if (!active || !active.word) return;
        if (!state.extraVocabularyItems) state.extraVocabularyItems = {};
        const term = active.word.trim(), key = term.toLowerCase(), part = (state.currentStory.parts || [])[state.currentPartIndex];
        state.extraVocabularyItems[key] = { term, phonetic: active.isPhrase ? "Cụm từ" : (active.ipa || "/.../"), pos: active.pos || (active.isPhrase ? "CỤM / CÂU" : "TỪ VỰNG"), meaning: active.meaning || `Nghĩa của "${term}"`, example: active.sentenceEn || "", exampleTr: active.sentenceVi || "", partIndex: state.currentPartIndex, tokenIndices: active.tokenIndices || [active.tokenIndex], isExtraLookup: true };
        if (part) { if (!part.targetWords) part.targetWords = []; if (!part.targetWords.some(w => w.term.toLowerCase() === key)) part.targetWords.push(state.extraVocabularyItems[key]); state.wordClassifications[term] = false; }
        window.dismissStoryWordActionPopup(); window.StoryReaderUI.renderTargetWordCard();
        if (typeof window.notifyStoryFlashcardAdded === 'function') window.notifyStoryFlashcardAdded(term);
    };
    window.dismissStoryWordActionPopup = () => {
        if (warnHintTimer) { clearTimeout(warnHintTimer); warnHintTimer = null; }
        setSentenceSpeakVisual(false); hideFingerLoupe();
        const popup = document.getElementById('storyWordActionPopup'), draftBar = document.getElementById('storyPhraseDraftBar'), state = window.StoryReaderState;
        if (popup) { popup.classList.add('hidden'); popup.classList.remove('is-swiping-phrase', 'is-warn-shake'); popup.style.display = 'none'; }
        if (draftBar) { draftBar.classList.add('hidden'); draftBar.style.display = 'none'; }
        if (state && (state.activePopupWord || (state.phraseDraftTokens && state.phraseDraftTokens.length > 0))) { state.activePopupWord = null; state.phraseDraftTokens = []; if (window.StoryReaderUI && typeof window.StoryReaderUI.refreshParagraphHighlights === 'function') { window.StoryReaderUI.refreshParagraphHighlights(); window.StoryReaderUI.updateProgressAndBottomNav(); } }
    };
    window.startStoryPhraseSelectionFromPopup = window.updateStoryPhraseDraftBarUI = function () {};
    window.toggleStoryPhraseToken = (t, w, s) => window.onStoryWordTap(null, t, encodeURIComponent(w || ""), s, true);
    window.cancelStoryPhraseDraft = () => window.dismissStoryWordActionPopup(); window.commitStoryPhraseDraft = () => window.openStoryWordDefinitionFromPopup();
})(window);
