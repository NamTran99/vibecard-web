/**
 * ==========================================================================
 * 📘 STORY WORD DEFINITION BOTTOM SHEET & SAVED WORD MODAL
 * 1:1 Replica from Android Native:
 * - WordDefinitionDialog.kt & LessonVocabularyActionDialog.kt
 * ==========================================================================
 */

(function (window) {
    'use strict';

    let activeLookupSession = null;
    let activeSavedWordKey = null;

    function resolveLexiconEntry(rawTerm, sentenceEn, sentenceVi) {
        const lower = (rawTerm || "").trim().toLowerCase();
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex] || {};
        const targetWords = currentPart.targetWords || [];

        const targetMatch = targetWords.find(w => w.term && w.term.toLowerCase() === lower);
        if (targetMatch) {
            return {
                term: rawTerm, ipa: targetMatch.phonetic || "/.../", pos: targetMatch.pos || "TỪ VỰNG",
                meaning: targetMatch.meaning || "Nghĩa trong ngữ cảnh",
                explanation: targetMatch.definition || `Trong câu này, "${rawTerm}" mang nghĩa "${targetMatch.meaning}".`,
                dictMeanings: [{ meaning: targetMatch.meaning, pos: targetMatch.pos || "TỪ VỰNG", sense: targetMatch.definition || targetMatch.example || "" }]
            };
        }

        const lexicon = window.BUILTIN_STORY_LEXICON || {};
        if (lexicon[lower]) {
            return Object.assign({ term: rawTerm }, lexicon[lower]);
        }

        const isPhrase = lower.includes(' ');
        return {
            term: rawTerm,
            ipa: isPhrase ? "Cụm từ" : "/.../",
            pos: isPhrase ? "CỤM TỪ" : "TỪ VỰNG",
            meaning: isPhrase ? `Cụm "${rawTerm}" trong ngữ cảnh câu` : `Nghĩa của "${rawTerm}" trong câu`,
            explanation: sentenceVi ? `Trong câu: "${sentenceVi}"` : `Từ/cụm từ xuất hiện trong câu: "${sentenceEn}"`,
            dictMeanings: [{
                meaning: isPhrase ? `Cụm diễn đạt "${rawTerm}"` : `Từ "${rawTerm}" theo ngữ cảnh truyện`,
                pos: isPhrase ? "CỤM TỪ" : "TỪ VỰNG",
                sense: sentenceEn || ""
            }],
            needsLiveTranslate: true
        };
    }
    window.resolveStoryLexiconEntry = resolveLexiconEntry;

    async function enrichLookupWithLiveTranslation(session) {
        if (!session || !session.needsLiveTranslate) return;
        const cleanLower = session.term.trim().toLowerCase();
        if (!cleanLower.includes(' ')) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanLower)}`)
                .then(r => r.ok ? r.json() : null)
                .then(arr => {
                    const entry = Array.isArray(arr) ? arr[0] : null;
                    const ph = entry && (entry.phonetic || ((entry.phonetics || []).find(p => p.text) || {}).text);
                    if (ph) {
                        session.ipa = ph;
                        const st = window.StoryReaderState;
                        if (st && st.extraVocabularyItems && st.extraVocabularyItems[cleanLower]) {
                            st.extraVocabularyItems[cleanLower].phonetic = ph;
                        }
                        if (activeLookupSession && activeLookupSession.term === session.term) {
                            renderWordDefinitionSheetUI(session);
                        }
                    }
                }).catch(() => {});
        }
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&dt=bd&q=${encodeURIComponent(session.term)}`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            const translated = (data && Array.isArray(data[0])) ? data[0].map(seg => (seg && seg[0]) || "").join('').trim() : "";
            if (!translated) return;

            let posLabel = session.pos;
            const dictOptions = [];
            if (data[1] && Array.isArray(data[1])) {
                data[1].forEach(group => {
                    const rawPos = (group[0] || "").toUpperCase();
                    const viPos = rawPos === "NOUN" ? "DANH TỪ"
                        : rawPos === "VERB" ? "ĐỘNG TỪ"
                        : rawPos === "ADJECTIVE" ? "TÍNH TỪ"
                        : rawPos === "ADVERB" ? "TRẠNG TỪ" : (rawPos || session.pos);
                    if (posLabel === "TỪ VỰNG") posLabel = viPos;
                    const terms = (group[1] || []).slice(0, 3).join(', ');
                    if (terms) {
                        dictOptions.push({
                            meaning: terms.charAt(0).toUpperCase() + terms.slice(1),
                            pos: viPos,
                            sense: `Nghĩa từ điển phổ biến của "${session.term}".`
                        });
                    }
                });
            }

            session.meaning = translated.charAt(0).toUpperCase() + translated.slice(1);
            session.pos = posLabel;
            session.explanation = session.sentenceVi
                ? `Trong ngữ cảnh câu truyện: "${session.sentenceVi}"`
                : `Nghĩa phù hợp nhất trong đoạn truyện hiện tại.`;
            session.dictMeanings = dictOptions.length > 0
                ? dictOptions
                : [{ meaning: session.meaning, pos: posLabel, sense: session.sentenceEn }];
            if (activeLookupSession && activeLookupSession.term === session.term) {
                renderWordDefinitionSheetUI(session);
            }
        } catch (e) {}
    }

    window.openStoryWordDefinitionFromPopup = function () {
        const state = window.StoryReaderState;
        const active = state.activePopupWord;
        if (!active) return;
        const word = active.word;
        const sentenceIdx = active.sentenceIdx;
        const tokenIndices = active.tokenIndices || [active.tokenIndex];
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        window.openStoryWordDefinitionSheet(word, sentenceIdx, tokenIndices);
    };

    window.openStoryWordDefinitionSheet = function (rawTerm, sentenceIdx = 0, tokenIndices = []) {
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex] || {};
        const sentences = (typeof window.getStoryPartSentences === 'function')
            ? window.getStoryPartSentences(currentPart) : [];
        const matchedSentence = sentences[sentenceIdx] || sentences[0] || {
            text: currentPart.contentEn || "",
            translation: currentPart.contentVi || ""
        };

        const resolved = resolveLexiconEntry(rawTerm, matchedSentence.text, matchedSentence.translation);
        activeLookupSession = {
            term: rawTerm,
            ipa: resolved.ipa,
            pos: resolved.pos,
            meaning: resolved.meaning,
            explanation: resolved.explanation,
            dictMeanings: resolved.dictMeanings || [],
            sentenceIdx: sentenceIdx,
            sentenceEn: matchedSentence.text,
            sentenceVi: matchedSentence.translation,
            tokenIndices: tokenIndices,
            selectedOptionKey: 'lumi',
            needsLiveTranslate: Boolean(resolved.needsLiveTranslate)
        };

        renderWordDefinitionSheetUI(activeLookupSession);
        const modal = document.getElementById('storyWordDefinitionModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
        if (activeLookupSession.needsLiveTranslate) enrichLookupWithLiveTranslation(activeLookupSession);
    };

    function renderWordDefinitionSheetUI(session) {
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('storyDefSheetWord', session.term);
        setEl('storyDefSheetIpa', session.ipa || "/.../");
        setEl('storyDefSheetContextVi', session.sentenceVi || "");

        const ctxEnEl = document.getElementById('storyDefSheetContextEn');
        if (ctxEnEl) {
            const escaped = session.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const reg = new RegExp(`(${escaped})`, 'gi');
            ctxEnEl.innerHTML = (session.sentenceEn || "").replace(reg, '<b class="text-[var(--m3-amber-glow)] underline">$1</b>');
        }

        const lumiCard = document.getElementById('storyDefLumiCard');
        if (lumiCard) {
            const isSelected = session.selectedOptionKey === 'lumi';
            lumiCard.className = `story-def-choice-card ${isSelected ? 'selected' : ''}`;
            lumiCard.innerHTML = `
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <span class="inline-block px-2 py-0.5 rounded bg-[var(--m3-amber-container)] text-[var(--m3-amber-text)] text-[10px] font-black uppercase mb-1.5">${session.pos} · THEO NGỮ CẢNH</span>
                        <div class="text-[17px] font-extrabold text-[var(--m3-on-surface)] leading-snug">${session.meaning}</div>
                        <div class="text-[13px] text-[var(--m3-on-surface-variant)] mt-1 leading-relaxed">${session.explanation}</div>
                    </div>
                    <div class="story-def-radio-dot ${isSelected ? 'checked' : ''}"></div>
                </div>`;
        }

        const dictList = document.getElementById('storyDefDictList');
        const dictCount = document.getElementById('storyDefDictCount');
        if (dictList) {
            const items = session.dictMeanings || [];
            if (dictCount) dictCount.textContent = `${items.length} lựa chọn`;
            dictList.innerHTML = items.map((d, idx) => {
                const key = `dict_${idx}`;
                const isSelected = session.selectedOptionKey === key;
                return `
                    <div onclick="selectStoryWordDefinitionOption('${key}')" class="story-def-choice-card ${isSelected ? 'selected' : ''}">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <span class="inline-block px-2 py-0.5 rounded bg-[var(--m3-secondary-container)] text-[var(--m3-on-secondary-container)] text-[10px] font-bold uppercase mb-1">${d.pos || session.pos}</span>
                                <div class="text-[15.5px] font-bold text-[var(--m3-on-surface)] leading-snug">${d.meaning}</div>
                                ${d.sense ? `<div class="text-[12.5px] text-[var(--m3-on-surface-variant)] mt-0.5 leading-relaxed">${d.sense}</div>` : ''}
                            </div>
                            <div class="story-def-radio-dot ${isSelected ? 'checked' : ''}"></div>
                        </div>
                    </div>`;
            }).join('');
        }
    }

    window.selectStoryWordDefinitionOption = function (optionKey) {
        if (!activeLookupSession) return;
        activeLookupSession.selectedOptionKey = optionKey;
        renderWordDefinitionSheetUI(activeLookupSession);
    };

    window.speakStoryLookupWord = function () {
        if (!activeLookupSession || !activeLookupSession.term || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(activeLookupSession.term);
            utter.lang = 'en-US';
            utter.rate = 0.95;
            window.speechSynthesis.speak(utter);
        } catch (e) {}
    };

    window.saveStoryLookupWord = function () {
        if (!activeLookupSession) return;
        const state = window.StoryReaderState;
        if (!state.extraVocabularyItems) state.extraVocabularyItems = {};

        let chosenMeaning = activeLookupSession.meaning;
        let chosenPos = activeLookupSession.pos;
        if (activeLookupSession.selectedOptionKey && activeLookupSession.selectedOptionKey.startsWith('dict_')) {
            const idx = parseInt(activeLookupSession.selectedOptionKey.replace('dict_', ''), 10);
            const dItem = (activeLookupSession.dictMeanings || [])[idx];
            if (dItem) {
                chosenMeaning = dItem.meaning;
                chosenPos = dItem.pos || chosenPos;
            }
        }

        const key = activeLookupSession.term.trim().toLowerCase();
        state.extraVocabularyItems[key] = {
            term: activeLookupSession.term.trim(),
            phonetic: activeLookupSession.ipa || "/.../",
            pos: chosenPos,
            meaning: chosenMeaning,
            example: activeLookupSession.sentenceEn || "",
            exampleTr: activeLookupSession.sentenceVi || "",
            partIndex: state.currentPartIndex,
            tokenIndices: activeLookupSession.tokenIndices || [],
            isExtraLookup: true
        };

        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        if (currentPart) {
            if (!currentPart.targetWords) currentPart.targetWords = [];
            if (!currentPart.targetWords.some(w => w.term.toLowerCase() === key)) {
                currentPart.targetWords.push(state.extraVocabularyItems[key]);
            }
            state.wordClassifications[activeLookupSession.term.trim()] = false;
        }

        state.phraseDraftTokens = [];
        if (typeof window.updateStoryPhraseDraftBarUI === 'function') window.updateStoryPhraseDraftBarUI();
        window.closeStoryWordDefinitionModal();
        window.StoryReaderUI.renderTargetWordCard();
        if (typeof window.notifyStoryFlashcardAdded === 'function') {
            window.notifyStoryFlashcardAdded(activeLookupSession.term.trim());
        }
    };

    window.closeStoryWordDefinitionModal = function (event) {
        if (event && event.target && event.target.id !== 'storyWordDefinitionModal') return;
        const modal = document.getElementById('storyWordDefinitionModal');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
    };

    window.openStorySavedWordActionModal = function (encodedTerm) {
        const term = decodeURIComponent(encodedTerm).trim();
        const key = term.toLowerCase();
        const state = window.StoryReaderState;
        const item = (state.extraVocabularyItems && state.extraVocabularyItems[key]) || null;
        if (!item) return;

        activeSavedWordKey = key;
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('storySavedModalTerm', item.term);
        setEl('storySavedModalPos', item.pos || "TỪ ĐÃ LƯU");
        setEl('storySavedModalIpa', item.phonetic || "/.../");
        setEl('storySavedModalMeaning', item.meaning || "");
        setEl('storySavedModalExEn', item.example || "");
        setEl('storySavedModalExVi', item.exampleTr || "");

        const modal = document.getElementById('storySavedWordActionModal');
        if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
    };

    window.speakActiveSavedStoryWord = function () {
        const state = window.StoryReaderState;
        const item = activeSavedWordKey && state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        if (!item || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(item.term);
            utter.lang = 'en-US';
            window.speechSynthesis.speak(utter);
        } catch (e) {}
    };

    window.removeStorySavedWord = function () {
        if (!activeSavedWordKey) return;
        const state = window.StoryReaderState;
        const item = state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        if (item) {
            delete state.extraVocabularyItems[activeSavedWordKey];
            delete state.wordClassifications[item.term];
            const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
            if (currentPart && currentPart.targetWords) {
                currentPart.targetWords = currentPart.targetWords.filter(w => w.term.toLowerCase() !== activeSavedWordKey);
            }
            if (typeof showDictToast === 'function') showDictToast(`🗑️ Đã bỏ chọn từ "${item.term}"`);
        }
        window.closeStorySavedWordActionModal();
        window.StoryReaderUI.renderTargetWordCard();
    };

    window.viewOtherMeaningForSavedWord = function () {
        const state = window.StoryReaderState;
        const item = activeSavedWordKey && state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        window.closeStorySavedWordActionModal();
        if (item) window.openStoryWordDefinitionSheet(item.term, 0, item.tokenIndices || []);
    };

    window.closeStorySavedWordActionModal = function (event) {
        if (event && event.target && event.target.id !== 'storySavedWordActionModal') return;
        const modal = document.getElementById('storySavedWordActionModal');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
    };
})(window);
