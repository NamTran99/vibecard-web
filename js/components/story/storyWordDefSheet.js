/**
 * ==========================================================================
 * 📘 STORY WORD DEFINITION BOTTOM SHEET & SAVED WORD MODAL
 * Unified Contextual Hero Card + Dictionary Senses + Custom Meaning
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

    function resolveLexiconEntry(rawTerm, sentenceEn) {
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
        if (lexicon[lower]) return Object.assign({ term: rawTerm }, lexicon[lower]);

        const isPhrase = lower.includes(' '), snippet = extractCollocationSnippet(rawTerm, sentenceEn);
        return {
            term: rawTerm, ipa: isPhrase ? "Cụm từ" : "", pos: isPhrase ? "CỤM TỪ" : "TỪ VỰNG",
            meaning: isPhrase ? `Đang dịch cụm "${rawTerm}"...` : `Đang tra nghĩa "${rawTerm}"...`,
            explanation: isPhrase
                ? `Cụm diễn đạt kết nối trực tiếp trong mạch câu chuyện hiện tại.`
                : `Xuất hiện trong cụm ${snippet} để bổ nghĩa cho ngữ cảnh câu chuyện.`,
            dictMeanings: [],
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
                        if (st && st.extraVocabularyItems && st.extraVocabularyItems[cleanLower]) st.extraVocabularyItems[cleanLower].phonetic = ph;
                    }
                    if (Array.isArray(entry.meanings)) {
                        entry.meanings.slice(0, 3).forEach(m => {
                            const defObj = (m.definitions && m.definitions[0]) || null;
                            if (defObj && defObj.definition) apiDefinitions.push(defObj.definition);
                        });
                        if (apiDefinitions.length > 0 && session.dictMeanings) {
                            session.dictMeanings.forEach((dm, idx) => { if (apiDefinitions[idx]) dm.sense = apiDefinitions[idx]; });
                        }
                    }
                    if (activeLookupSession && activeLookupSession.term === session.term) renderWordDefinitionSheetUI(session);
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
            const posMap = { NOUN: "DANH TỪ", VERB: "ĐỘNG TỪ", ADJECTIVE: "TÍNH TỪ", ADVERB: "TRẠNG TỪ", PREPOSITION: "GIỚI TỪ", CONJUNCTION: "LIÊN TỪ", PRONOUN: "ĐẠI TỪ", ARTICLE: "MẠO TỪ" };
            if (data[1] && Array.isArray(data[1])) {
                data[1].forEach((group, gIdx) => {
                    const rawPos = (group[0] || "").toUpperCase();
                    const viPos = posMap[rawPos] || rawPos || session.pos;
                    if (posLabel === "TỪ VỰNG") posLabel = viPos;
                    const terms = (group[1] || []).slice(0, 4).join(', ');
                    if (terms) {
                        dictOptions.push({
                            meaning: terms.charAt(0).toUpperCase() + terms.slice(1),
                            pos: viPos,
                            sense: apiDefinitions[gIdx] || `Các sắc thái nghĩa ${viPos.toLowerCase()} thông dụng của «${session.term}».`
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
                : `Kết hợp trong cụm ${snippet} — mang nghĩa «${capMeaning}» phù hợp nhất với mạch truyện.`;
            session.dictMeanings = dictOptions.length > 0 ? dictOptions : (apiDefinitions.length > 0 ? [{
                meaning: capMeaning, pos: posLabel === "TỪ VỰNG" ? "TỪ ĐIỂN" : posLabel, sense: apiDefinitions[0]
            }] : []);
            if (activeLookupSession && activeLookupSession.term === session.term) renderWordDefinitionSheetUI(session);
        } catch (e) {}
    }

    window.openStoryWordDefinitionFromPopup = function () {
        const state = window.StoryReaderState, active = state.activePopupWord;
        if (!active) return;
        const word = active.word, sentenceIdx = active.sentenceIdx, tokenIndices = active.tokenIndices || [active.tokenIndex];
        if (typeof window.dismissStoryWordActionPopup === 'function') window.dismissStoryWordActionPopup();
        window.openStoryWordDefinitionSheet(word, sentenceIdx, tokenIndices);
    };

    window.openStoryWordDefinitionSheet = function (rawTerm, sentenceIdx = 0, tokenIndices = []) {
        const state = window.StoryReaderState, currentPart = (state.currentStory.parts || [])[state.currentPartIndex] || {};
        const sentences = (typeof window.getStoryPartSentences === 'function') ? window.getStoryPartSentences(currentPart) : [];
        const matchedSentence = sentences[sentenceIdx] || sentences[0] || { text: currentPart.contentEn || "", translation: currentPart.contentVi || "" };
        const resolved = resolveLexiconEntry(rawTerm, matchedSentence.text, matchedSentence.translation);
        activeLookupSession = {
            term: rawTerm, ipa: resolved.ipa, pos: resolved.pos, meaning: resolved.meaning,
            explanation: resolved.explanation, dictMeanings: resolved.dictMeanings || [],
            sentenceIdx, sentenceEn: matchedSentence.text, sentenceVi: matchedSentence.translation,
            tokenIndices, selectedOptionKey: 'lumi', customMeaning: '', needsLiveTranslate: Boolean(resolved.needsLiveTranslate)
        };
        renderWordDefinitionSheetUI(activeLookupSession);
        const modal = document.getElementById('storyWordDefinitionModal');
        if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
        if (activeLookupSession.needsLiveTranslate) enrichLookupWithLiveTranslation(activeLookupSession);
    };

    function getActiveSelectedMeaning(session) {
        if (!session) return "";
        if (session.selectedOptionKey === 'custom' && session.customMeaning.trim()) return session.customMeaning.trim();
        if (session.selectedOptionKey && session.selectedOptionKey.startsWith('dict_')) {
            const idx = parseInt(session.selectedOptionKey.replace('dict_', ''), 10);
            const dItem = (session.dictMeanings || [])[idx];
            if (dItem) return dItem.meaning;
        }
        return session.meaning || "";
    }

    function renderWordDefinitionSheetUI(session) {
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('storyDefSheetWord', session.term);
        setEl('storyDefHeaderPos', session.pos || "TỪ VỰNG");
        const cleanIpa = (session.ipa && session.ipa !== '/.../') ? session.ipa : (session.term.includes(' ') ? 'Nghe cụm' : 'Phát âm');
        setEl('storyDefSheetIpa', cleanIpa);

        const clean = (session.term || "").trim(), escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(clean.includes(' ') ? `(${escaped})` : `(\\b${escaped}\\b)`, 'gi');
        const highlightedEn = (session.sentenceEn || "").replace(reg, '<mark class="story-def-ctx-hl">$1</mark>');

        const lumiCard = document.getElementById('storyDefLumiCard');
        if (lumiCard) {
            const isSelected = session.selectedOptionKey === 'lumi';
            lumiCard.className = `story-def-choice-card is-lumi-card ${isSelected ? 'selected' : ''}`;
            lumiCard.innerHTML = `
                <div class="story-def-card-top">
                    <div class="story-def-badge-group">
                        <span class="story-def-lumi-pill">✦ NGHĨA TRONG MẠCH TRUYỆN</span>
                    </div>
                    <div class="story-def-radio-dot ${isSelected ? 'checked' : ''}">✓</div>
                </div>
                <div class="story-def-meaning-main">${session.meaning}</div>
                <div class="story-def-lumi-note">💡 ${session.explanation}</div>
                <div class="story-def-embedded-ctx" onclick="event.stopPropagation()">
                    <div class="story-def-embedded-ctx-head">
                        <span>📖 NGỮ CẢNH CÂU TRUYỆN</span>
                        <button type="button" onclick="speakStoryDefContextSentence()" class="story-def-ctx-tts-btn">🔊 Nghe câu</button>
                    </div>
                    <div class="story-def-ctx-en">${highlightedEn}</div>
                    ${session.sentenceVi ? `<div class="story-def-ctx-vi">${session.sentenceVi}</div>` : ''}
                </div>`;
        }

        const dictList = document.getElementById('storyDefDictList'), dictCount = document.getElementById('storyDefDictCount');
        if (dictList) {
            const items = session.dictMeanings || [];
            if (dictCount) dictCount.textContent = items.length > 0 ? `${items.length} nghĩa mở rộng` : `Tùy chỉnh`;
            const dictCardsHtml = items.map((d, idx) => {
                const key = `dict_${idx}`, isSelected = session.selectedOptionKey === key;
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

            const isCustom = session.selectedOptionKey === 'custom';
            const customCardHtml = `
                <div onclick="selectStoryWordDefinitionOption('custom')" class="story-def-choice-card is-custom-card ${isCustom ? 'selected' : ''}">
                    <div class="story-def-card-top">
                        <div class="story-def-badge-group">
                            <span class="story-def-pos-tag is-dict">✏️ TỰ GHI NGHĨA RIÊNG</span>
                        </div>
                        <div class="story-def-radio-dot ${isCustom ? 'checked' : ''}">✓</div>
                    </div>
                    <input id="storyDefCustomInput" type="text" class="story-def-custom-input"
                        placeholder="Nhập nghĩa hoặc ghi chú bạn muốn lưu vào thẻ..."
                        value="${(session.customMeaning || '').replace(/"/g, '&quot;')}"
                        onclick="event.stopPropagation(); selectStoryWordDefinitionOption('custom', true)"
                        oninput="onStoryDefCustomInput(this.value)" />
                </div>`;
            dictList.innerHTML = dictCardsHtml + customCardHtml;
        }
        updateSaveButtonLabel(session);
    }

    function updateSaveButtonLabel(session) {
        const btnLabel = document.getElementById('storyDefSaveBtnLabel');
        if (!btnLabel || !session) return;
        const chosen = getActiveSelectedMeaning(session);
        const shortMeaning = chosen.length > 26 ? chosen.slice(0, 25) + '…' : chosen;
        btnLabel.textContent = shortMeaning ? `+ Lưu thẻ · «${shortMeaning}»` : `+ Lưu vào Flashcard`;
    }

    window.onStoryDefCustomInput = function (val) {
        if (!activeLookupSession) return;
        activeLookupSession.customMeaning = val || "";
        activeLookupSession.selectedOptionKey = 'custom';
        updateSaveButtonLabel(activeLookupSession);
    };

    window.selectStoryWordDefinitionOption = function (optionKey, focusInput) {
        if (!activeLookupSession) return;
        activeLookupSession.selectedOptionKey = optionKey;
        renderWordDefinitionSheetUI(activeLookupSession);
        if (optionKey === 'custom' || focusInput) {
            setTimeout(() => { const inp = document.getElementById('storyDefCustomInput'); if (inp) inp.focus(); }, 20);
        }
    };

    window.speakStoryLookupWord = function () {
        if (!activeLookupSession || !activeLookupSession.term || !('speechSynthesis' in window)) return;
        try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(activeLookupSession.term); u.lang = 'en-US'; u.rate = 0.95; window.speechSynthesis.speak(u); } catch (e) {}
    };

    window.speakStoryDefContextSentence = function () {
        if (!activeLookupSession || !activeLookupSession.sentenceEn || !('speechSynthesis' in window)) return;
        try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(activeLookupSession.sentenceEn); u.lang = 'en-US'; u.rate = 0.94; window.speechSynthesis.speak(u); } catch (e) {}
    };

    window.saveStoryLookupWord = function () {
        if (!activeLookupSession) return;
        const state = window.StoryReaderState;
        if (!state.extraVocabularyItems) state.extraVocabularyItems = {};

        let chosenMeaning = getActiveSelectedMeaning(activeLookupSession), chosenPos = activeLookupSession.pos;
        if (activeLookupSession.selectedOptionKey && activeLookupSession.selectedOptionKey.startsWith('dict_')) {
            const idx = parseInt(activeLookupSession.selectedOptionKey.replace('dict_', ''), 10);
            const dItem = (activeLookupSession.dictMeanings || [])[idx];
            if (dItem) chosenPos = dItem.pos || chosenPos;
        }

        const key = activeLookupSession.term.trim().toLowerCase();
        state.extraVocabularyItems[key] = {
            term: activeLookupSession.term.trim(), phonetic: activeLookupSession.ipa || "", pos: chosenPos,
            meaning: chosenMeaning, example: activeLookupSession.sentenceEn || "", exampleTr: activeLookupSession.sentenceVi || "",
            partIndex: state.currentPartIndex, tokenIndices: activeLookupSession.tokenIndices || [], isExtraLookup: true
        };

        const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
        if (currentPart) {
            if (!currentPart.targetWords) currentPart.targetWords = [];
            if (!currentPart.targetWords.some(w => w.term.toLowerCase() === key)) currentPart.targetWords.push(state.extraVocabularyItems[key]);
            state.wordClassifications[activeLookupSession.term.trim()] = false;
        }

        state.phraseDraftTokens = [];
        if (typeof window.updateStoryPhraseDraftBarUI === 'function') window.updateStoryPhraseDraftBarUI();
        window.closeStoryWordDefinitionModal();
        window.StoryReaderUI.renderTargetWordCard();
        if (typeof window.notifyStoryFlashcardAdded === 'function') window.notifyStoryFlashcardAdded(activeLookupSession.term.trim());
    };

    window.closeStoryWordDefinitionModal = function (event) {
        if (event && event.target && event.target.id !== 'storyWordDefinitionModal') return;
        const modal = document.getElementById('storyWordDefinitionModal');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
    };

    window.openStorySavedWordActionModal = function (encodedTerm) {
        const term = decodeURIComponent(encodedTerm).trim(), key = term.toLowerCase();
        const state = window.StoryReaderState, item = (state.extraVocabularyItems && state.extraVocabularyItems[key]) || null;
        if (!item) return;
        activeSavedWordKey = key;
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('storySavedModalTerm', item.term); setEl('storySavedModalPos', item.pos || "TỪ ĐÃ LƯU");
        setEl('storySavedModalIpa', (item.phonetic && item.phonetic !== '/.../') ? item.phonetic : "Phát âm");
        setEl('storySavedModalMeaning', item.meaning || ""); setEl('storySavedModalExEn', item.example || ""); setEl('storySavedModalExVi', item.exampleTr || "");
        const modal = document.getElementById('storySavedWordActionModal');
        if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
    };

    window.speakActiveSavedStoryWord = function () {
        const state = window.StoryReaderState, item = activeSavedWordKey && state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        if (!item || !('speechSynthesis' in window)) return;
        try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(item.term); u.lang = 'en-US'; window.speechSynthesis.speak(u); } catch (e) {}
    };

    window.removeStorySavedWord = function () {
        if (!activeSavedWordKey) return;
        const state = window.StoryReaderState, item = state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        if (item) {
            delete state.extraVocabularyItems[activeSavedWordKey]; delete state.wordClassifications[item.term];
            const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
            if (currentPart && currentPart.targetWords) currentPart.targetWords = currentPart.targetWords.filter(w => w.term.toLowerCase() !== activeSavedWordKey);
            if (typeof showDictToast === 'function') showDictToast(`🗑️ Đã bỏ chọn từ "${item.term}"`);
        }
        window.closeStorySavedWordActionModal(); window.StoryReaderUI.renderTargetWordCard();
    };

    window.viewOtherMeaningForSavedWord = function () {
        const state = window.StoryReaderState, item = activeSavedWordKey && state.extraVocabularyItems ? state.extraVocabularyItems[activeSavedWordKey] : null;
        window.closeStorySavedWordActionModal();
        if (item) window.openStoryWordDefinitionSheet(item.term, 0, item.tokenIndices || []);
    };

    window.closeStorySavedWordActionModal = function (event) {
        if (event && event.target && event.target.id !== 'storySavedWordActionModal') return;
        const modal = document.getElementById('storySavedWordActionModal');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
    };
})(window);
