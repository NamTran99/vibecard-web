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

    function extractCollocationSnippet(rawTerm, sentenceEn) {
        if (!rawTerm || !sentenceEn) return "";
        const cleanTerm = rawTerm.trim();
        if (cleanTerm.includes(' ')) return `«${cleanTerm}»`;
        const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(`(?:[A-Za-z']+\\s+)?\\b${escaped}\\b(?:\\s+[A-Za-z']+){0,2}`, 'gi');
        const matches = sentenceEn.match(reg);
        if (matches && matches.length > 0) {
            const unique = Array.from(new Set(matches.map(m => m.trim()))).slice(0, 2);
            return unique.map(m => `«${m}»`).join(', ');
        }
        return `«${cleanTerm}»`;
    }

    function resolveLexiconEntry(rawTerm, sentenceEn, sentenceVi) {
        const lower = (rawTerm || "").trim().toLowerCase();
        const state = window.StoryReaderState;
        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex] || {};
        const targetWords = currentPart.targetWords || [];

        const targetMatch = targetWords.find(w => w.term && w.term.toLowerCase() === lower);
        if (targetMatch) {
            return {
                term: rawTerm, ipa: targetMatch.phonetic || "", pos: targetMatch.pos || "TỪ VỰNG",
                meaning: targetMatch.meaning || "Nghĩa trong ngữ cảnh",
                explanation: targetMatch.definition || `Xuất hiện trong cụm ${extractCollocationSnippet(rawTerm, sentenceEn)} — mang nghĩa "${targetMatch.meaning}".`,
                dictMeanings: [{ meaning: targetMatch.meaning, pos: targetMatch.pos || "TỪ VỰNG", sense: targetMatch.definition || "Nghĩa chuẩn theo từ điển ngữ cảnh câu chuyện." }]
            };
        }

        const lexicon = window.BUILTIN_STORY_LEXICON || {};
        if (lexicon[lower]) {
            return Object.assign({ term: rawTerm }, lexicon[lower]);
        }

        const isPhrase = lower.includes(' ');
        const snippet = extractCollocationSnippet(rawTerm, sentenceEn);
        return {
            term: rawTerm,
            ipa: isPhrase ? "Cụm từ" : "",
            pos: isPhrase ? "CỤM TỪ" : "TỪ VỰNG",
            meaning: isPhrase ? `Đang dịch cụm "${rawTerm}"...` : `Đang tra nghĩa "${rawTerm}"...`,
            explanation: isPhrase
                ? `Cụm diễn đạt kết nối trực tiếp trong mạch câu chuyện hiện tại.`
                : `Xuất hiện trong cụm ${snippet} để bổ nghĩa cho ngữ cảnh câu chuyện.`,
            dictMeanings: [{
                meaning: isPhrase ? `Cụm từ "${rawTerm}"` : `Nghĩa thông dụng của "${rawTerm}"`,
                pos: isPhrase ? "CỤM TỪ" : "TỪ ĐIỂN",
                sense: isPhrase ? "Cách diễn đạt theo cụm trong văn viết tiếng Anh." : "Nghĩa gốc phổ biến trong từ điển tiếng Anh."
            }],
            needsLiveTranslate: true
        };
    }
    window.resolveStoryLexiconEntry = resolveLexiconEntry;

    async function enrichLookupWithLiveTranslation(session) {
        if (!session || !session.needsLiveTranslate) return;
        const cleanLower = session.term.trim().toLowerCase();
        let apiDefinitions = [];

        if (!cleanLower.includes(' ')) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanLower)}`)
                .then(r => r.ok ? r.json() : null)
                .then(arr => {
                    const entry = Array.isArray(arr) ? arr[0] : null;
                    if (!entry) return;
                    const ph = entry.phonetic || ((entry.phonetics || []).find(p => p.text) || {}).text;
                    if (ph) {
                        session.ipa = ph;
                        const st = window.StoryReaderState;
                        if (st && st.extraVocabularyItems && st.extraVocabularyItems[cleanLower]) {
                            st.extraVocabularyItems[cleanLower].phonetic = ph;
                        }
                    }
                    if (Array.isArray(entry.meanings)) {
                        entry.meanings.slice(0, 2).forEach(m => {
                            const defObj = (m.definitions && m.definitions[0]) || null;
                            if (defObj && defObj.definition) apiDefinitions.push(defObj.definition);
                        });
                        if (apiDefinitions.length > 0 && session.dictMeanings && session.dictMeanings.length > 0) {
                            session.dictMeanings.forEach((dm, idx) => {
                                if (apiDefinitions[idx]) dm.sense = apiDefinitions[idx];
                            });
                        }
                    }
                    if (activeLookupSession && activeLookupSession.term === session.term) {
                        renderWordDefinitionSheetUI(session);
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
                data[1].forEach((group, gIdx) => {
                    const rawPos = (group[0] || "").toUpperCase();
                    const viPos = rawPos === "NOUN" ? "DANH TỪ"
                        : rawPos === "VERB" ? "ĐỘNG TỪ"
                        : rawPos === "ADJECTIVE" ? "TÍNH TỪ"
                        : rawPos === "ADVERB" ? "TRẠNG TỪ"
                        : rawPos === "PREPOSITION" ? "GIỚI TỪ"
                        : rawPos === "CONJUNCTION" ? "LIÊN TỪ"
                        : rawPos === "PRONOUN" ? "ĐẠI TỪ"
                        : rawPos === "ARTICLE" ? "MẠO TỪ" : (rawPos || session.pos);
                    if (posLabel === "TỪ VỰNG") posLabel = viPos;
                    const terms = (group[1] || []).slice(0, 4).join(', ');
                    if (terms) {
                        dictOptions.push({
                            meaning: terms.charAt(0).toUpperCase() + terms.slice(1),
                            pos: viPos,
                            sense: apiDefinitions[gIdx] || `Các sắc thái nghĩa ${viPos.toLowerCase()} phổ biến của «${session.term}».`
                        });
                    }
                });
            }

            const capMeaning = translated.charAt(0).toUpperCase() + translated.slice(1);
            const snippet = extractCollocationSnippet(session.term, session.sentenceEn);
            session.meaning = capMeaning;
            session.pos = posLabel;
            session.explanation = session.term.includes(' ')
                ? `Cụm từ ${snippet} mang nghĩa «${capMeaning}», giúp câu văn mượt mà và giàu hình ảnh hơn.`
                : `Kết hợp trong cụm ${snippet} — mang nghĩa «${capMeaning}» phù hợp nhất với ngữ cảnh câu chuyện.`;
            session.dictMeanings = dictOptions.length > 0
                ? dictOptions
                : [{
                    meaning: capMeaning,
                    pos: posLabel === "TỪ VỰNG" ? "NGHĨA GỐC" : posLabel,
                    sense: apiDefinitions[0] || `Nghĩa từ điển tiêu chuẩn khi tra cứu độc lập của «${session.term}».`
                }];
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
        const cleanIpa = (session.ipa && session.ipa !== '/.../') ? session.ipa : (session.term.includes(' ') ? 'Nghe cụm' : 'Phát âm');
        setEl('storyDefSheetIpa', cleanIpa);
        setEl('storyDefSheetContextVi', session.sentenceVi || "");

        const ctxEnEl = document.getElementById('storyDefSheetContextEn');
        if (ctxEnEl) {
            const clean = (session.term || "").trim();
            const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = clean.includes(' ') ? `(${escaped})` : `(\\b${escaped}\\b)`;
            const reg = new RegExp(pattern, 'gi');
            ctxEnEl.innerHTML = (session.sentenceEn || "").replace(reg, '<mark class="story-def-ctx-hl">$1</mark>');
        }

        const lumiCard = document.getElementById('storyDefLumiCard');
        if (lumiCard) {
            const isSelected = session.selectedOptionKey === 'lumi';
            lumiCard.className = `story-def-choice-card is-lumi-card ${isSelected ? 'selected' : ''}`;
            lumiCard.innerHTML = `
                <div class="story-def-card-top">
                    <div class="story-def-badge-group">
                        <span class="story-def-lumi-pill">✦ THEO NGỮ CẢNH</span>
                        <span class="story-def-pos-tag">${session.pos}</span>
                    </div>
                    <div class="story-def-radio-dot ${isSelected ? 'checked' : ''}">✓</div>
                </div>
                <div class="story-def-meaning-main">${session.meaning}</div>
                <div class="story-def-meaning-sub">${session.explanation}</div>`;
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
                        <div class="story-def-card-top">
                            <div class="story-def-badge-group">
                                <span class="story-def-sense-num">#${idx + 1}</span>
                                <span class="story-def-pos-tag is-dict">${d.pos || session.pos}</span>
                            </div>
                            <div class="story-def-radio-dot ${isSelected ? 'checked' : ''}">✓</div>
                        </div>
                        <div class="story-def-meaning-dict">${d.meaning}</div>
                        ${d.sense ? `<div class="story-def-meaning-sub">${d.sense}</div>` : ''}
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

    window.speakStoryDefContextSentence = function () {
        if (!activeLookupSession || !activeLookupSession.sentenceEn || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(activeLookupSession.sentenceEn);
            utter.lang = 'en-US';
            utter.rate = 0.94;
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
            phonetic: activeLookupSession.ipa || "",
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
        setEl('storySavedModalIpa', (item.phonetic && item.phonetic !== '/.../') ? item.phonetic : "Phát âm");
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
