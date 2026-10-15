/**
 * ==========================================================================
 * 🗂️ STORY ADDED FLASHCARDS COUNTER & 2-SIDED FLIPPABLE FLASHCARD LIST
 * Ported 1:1 from Android:
 * - FlippableFlashcardView.kt (2-stage 150ms/300ms 3D Y-rotation + Overshoot)
 * - ImageTextManualSaveViews.kt (saveLessonFlashcardView, Front & Back faces)
 * - MainActivityLessonFlashcards.kt (highlightBracketedFlashcardTerm, Tabs)
 * Separated according to SRP (< 350 lines/file rule)
 * ==========================================================================
 */

(function (window) {
    'use strict';

    let bumpTimer = null, heroHudTimer = null;
    const cardFlipStates = {}; // key -> { showingBack, flipInProgress, activeTab, showExTr }

    const POS_VI_MAP = {
        VERB: 'VERB • Động từ', NOUN: 'NOUN • Danh từ', ADJ: 'ADJ • Tính từ',
        ADV: 'ADV • Trạng từ', PHRASE: 'PHRASE • Cụm từ', 'CỤM TỪ': 'PHRASE • Cụm từ', 'TỪ VỰNG': 'WORD • Từ vựng'
    };

    const DEFAULT_SYNONYMS = {
        'beautiful morning': ['bright dawn', 'lovely daybreak', 'sunny morning'],
        'braked abruptly': ['stopped suddenly', 'halted sharply', 'slammed the brakes'],
        'calm smile': ['serene grin', 'gentle smile', 'peaceful expression'],
        'leisurely': ['unhurriedly', 'calmly', 'at an easy pace'],
        'deeply astonished': ['utterly amazed', 'stunned', 'shocked'],
        'leaped forward': ['sprang ahead', 'bounded forward', 'dashed out'],
        'measured stride': ['steady step', 'deliberate pace', 'even rhythm'],
        'arrogant': ['conceited', 'haughty', 'overconfident'],
        'profound slumber': ['deep sleep', 'heavy nap', 'sound rest']
    };

    const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function findSentenceInText(text, term) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        if (!term) return sentences[0] || '';
        const lowerTerm = term.toLowerCase();
        return sentences.find(s => s.toLowerCase().includes(lowerTerm)) || sentences[0] || '';
    }

    function highlightTermInSentence(sentence, term) {
        const cleanSent = String(sentence || '').trim(), cleanTerm = String(term || '').trim();
        if (!cleanSent) return `<span class="story-flip-prompt-hl">${escapeHtml(cleanTerm)}</span>`;
        const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), regex = new RegExp(`(${escaped})`, 'i');
        if (regex.test(cleanSent)) return escapeHtml(cleanSent).replace(regex, '<span class="story-flip-prompt-hl">$1</span>');
        return `${escapeHtml(cleanSent)} <span class="story-flip-prompt-hl">${escapeHtml(cleanTerm)}</span>`;
    }

    function formatMeaningSpannable(meaning) {
        const raw = String(meaning || 'Ý nghĩa từ vựng').trim(), commaIdx = raw.indexOf(',');
        if (commaIdx === -1) return `<span class="story-flip-back-meaning-primary">${escapeHtml(raw)}</span>`;
        return `<span class="story-flip-back-meaning-primary">${escapeHtml(raw.slice(0, commaIdx))}</span><span class="story-flip-back-meaning-rest">${escapeHtml(raw.slice(commaIdx))}</span>`;
    }

    function getStoryAddedFlashcards() {
        const state = window.StoryReaderState;
        if (!state || !state.currentStory) return [];
        const addedMap = new Map(), parts = state.currentStory.parts || [];

        function normalizeItem(w, partIdx, isExtra) {
            const pIdx = typeof w.partIndex === 'number' ? w.partIndex : partIdx;
            const partObj = parts[pIdx] || parts[0] || {}, termLower = w.term.toLowerCase();
            const exampleEn = w.example || findSentenceInText(partObj.contentEn, w.term) || `They noticed "${w.term}" during the story.`;
            const exampleVi = w.exampleTr || findSentenceInText(partObj.contentVi, '') || w.meaning || '';
            const usage = (w.usageNote || w.definition)
                ? `${w.definition ? w.definition + ' — ' : ''}Xuất hiện trong Cảnh ${pIdx + 1} (${partObj.title || 'Truyện đọc'}) để nhấn mạnh ngữ cảnh câu chuyện.`
                : `Cụm/từ quan trọng trong Cảnh ${pIdx + 1} ("${partObj.title || 'Ngụ ngôn'}"), dùng để miêu tả hành động hoặc trạng thái nhân vật.`;
            const synonyms = (Array.isArray(w.synonyms) && w.synonyms.length > 0) ? w.synonyms : (DEFAULT_SYNONYMS[termLower] || [w.term, 'context expression', 'story idiom']);
            return {
                term: w.term, phonetic: (!w.phonetic || w.phonetic === 'Cụm từ') ? '' : w.phonetic,
                pos: w.pos || 'WORD', meaning: w.meaning || `Nghĩa của "${w.term}"`,
                example: exampleEn, exampleTr: exampleVi, usageNote: usage, synonyms: synonyms,
                partIndex: pIdx, partTitle: partObj.title || `Phần ${pIdx + 1}`,
                imageUrl: partObj.imageUrl || 'assets/cards/lumi_farmer_strawhat.jpg',
                isExtraLookup: Boolean(isExtra || w.isExtraLookup)
            };
        }

        parts.forEach((part, partIdx) => {
            (part.targetWords || []).forEach(w => {
                if (w && w.term && state.wordClassifications && state.wordClassifications[w.term] === false) {
                    addedMap.set(w.term.toLowerCase(), normalizeItem(w, partIdx, false));
                }
            });
        });

        if (state.extraVocabularyItems) {
            Object.keys(state.extraVocabularyItems).forEach(k => {
                const item = state.extraVocabularyItems[k];
                if (item && item.term && state.wordClassifications[item.term] === false && !addedMap.has(k)) {
                    addedMap.set(k, normalizeItem(item, state.currentPartIndex || 0, true));
                }
            });
        }

        const orderList = Array.isArray(state.addedFlashcardsOrder) ? state.addedFlashcardsOrder : [];
        return Array.from(addedMap.values()).sort((a, b) => {
            const idxA = orderList.indexOf(a.term.toLowerCase()), idxB = orderList.indexOf(b.term.toLowerCase());
            return (idxA === -1 && idxB === -1) ? 0 : (idxA === -1 ? 1 : (idxB === -1 ? -1 : idxB - idxA));
        });
    }
    window.getStoryAddedFlashcards = getStoryAddedFlashcards;

    window.notifyStoryFlashcardAdded = function (term) {
        const state = window.StoryReaderState;
        if (!state) return;
        if (!Array.isArray(state.addedFlashcardsOrder)) state.addedFlashcardsOrder = [];
        const lower = (term || '').trim().toLowerCase();
        if (lower) {
            state.addedFlashcardsOrder = state.addedFlashcardsOrder.filter(k => k !== lower);
            state.addedFlashcardsOrder.push(lower);
            state.lastAddedFlashcardKey = state.lastAddedFlashcardTerm = lower;
            cardFlipStates[lower] = { showingBack: false, flipInProgress: false, activeTab: 'example', showExTr: true };
        }
        if (window.StoryReaderUI && typeof window.StoryReaderUI.refreshParagraphHighlights === 'function') window.StoryReaderUI.refreshParagraphHighlights();
        renderStoryAddedCardsUI();
        triggerFlashcardCounterBumpAnimation();
    };

    function scheduleHeroHeaderAutoHide(delayMs = 1800) {
        if (heroHudTimer) clearTimeout(heroHudTimer);
        heroHudTimer = setTimeout(() => {
            const state = window.StoryReaderState || {}, header = document.getElementById('storyHeroHeader'), actionPill = document.getElementById('storyActionPill');
            if (header) header.classList.add('story-header-auto-hidden');
            if (actionPill && !state.isAudioPlaying) actionPill.classList.add('story-header-auto-hidden');
        }, delayMs);
    }

    window.revealStoryHeroHeaderTemporarily = function () {
        const header = document.getElementById('storyHeroHeader'), actionPill = document.getElementById('storyActionPill');
        if (header) header.classList.remove('story-header-auto-hidden');
        if (actionPill) actionPill.classList.remove('story-header-auto-hidden');
        scheduleHeroHeaderAutoHide(2600);
    };

    function triggerFlashcardCounterBumpAnimation() {
        const pillBtn = document.getElementById('storyAddedCardsPillBtn'), pillPlusOne = document.getElementById('storyAddedCardsPillPlusOne');
        if (pillBtn) { pillBtn.classList.remove('badge-bump'); void pillBtn.offsetWidth; pillBtn.classList.add('badge-bump'); }
        if (pillPlusOne) { pillPlusOne.classList.remove('pop-active'); void pillPlusOne.offsetWidth; pillPlusOne.classList.add('pop-active'); }
        if (bumpTimer) clearTimeout(bumpTimer);
        bumpTimer = setTimeout(() => {
            if (pillBtn) pillBtn.classList.remove('badge-bump');
            if (pillPlusOne) pillPlusOne.classList.remove('pop-active');
        }, 900);
    }

    const getCardState = (termKey) => cardFlipStates[termKey] || (cardFlipStates[termKey] = { showingBack: false, flipInProgress: false, activeTab: 'example', showExTr: true });

    function renderBackTabInnerHTML(card, st, encTerm) {
        if (st.activeTab === 'usage') return `<p class="story-flip-usage-text">${escapeHtml(card.usageNote)}</p>`;
        if (st.activeTab === 'synonym') {
            return `<div class="story-flip-synonym-wrap">${(card.synonyms || []).map(syn => `<button type="button" onclick="event.stopPropagation(); speakAddedStoryCard('${encodeURIComponent(syn)}')" class="story-flip-synonym-pill"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>${escapeHtml(syn)}</span></button>`).join('')}</div>`;
        }
        const highlightedEx = highlightTermInSentence(card.example, card.term);
        return `<div class="story-flip-back-ex-wrap" onclick="event.stopPropagation(); toggleStorySavedCardExTranslation('${encTerm}')">
                <p class="story-flip-back-ex-en">“${highlightedEx}”</p>
                ${st.showExTr && card.exampleTr ? `<p class="story-flip-back-ex-vi">${escapeHtml(card.exampleTr)}</p>` : ''}
                ${card.exampleTr ? `<span class="story-flip-back-ex-toggle">${st.showExTr ? 'Ẩn bản dịch ▲' : 'Xem bản dịch ▼'}</span>` : ''}
            </div>`;
    }

    function buildAddedCardItemHTML(card, idx, total, isJustAdded) {
        const termKey = card.term.toLowerCase(), st = getCardState(termKey), encTerm = encodeURIComponent(card.term);
        const posLabel = POS_VI_MAP[String(card.pos || '').toUpperCase()] || card.pos || 'WORD';
        const sourceTag = card.isExtraLookup ? `Tự chọn • Đoạn ${card.partIndex + 1}` : `Đoạn ${card.partIndex + 1} • ${card.partTitle}`;
        const hasIpa = Boolean(card.phonetic && card.phonetic !== '/.../');

        return `<div id="storySavedFlipCard_${idx}" data-term-key="${escapeHtml(termKey)}" class="story-flippable-card ${isJustAdded ? 'just-added' : ''}" onclick="flipStorySavedCard(${idx}, '${encTerm}')">
            <div class="story-flippable-face story-flippable-front" style="display: ${st.showingBack ? 'none' : 'flex'}; transform: rotateY(0deg); opacity: 1;">
                <div class="story-flip-header">
                    <div class="story-flip-badge-group">
                        <span class="story-flip-level-badge"><span class="story-flip-badge-dot"></span>${escapeHtml(sourceTag)}</span>
                        ${isJustAdded ? '<span class="story-flip-new-badge">Mới thêm</span>' : ''}
                    </div>
                    <div class="story-flip-header-right">
                        <span class="story-flip-counter">${idx + 1} / ${total}</span>
                        <button type="button" onclick="event.stopPropagation(); removeAddedStoryCard('${encTerm}')" class="story-flip-icon-btn" title="Xoá khỏi bộ thẻ" aria-label="Xoá thẻ">✕</button>
                    </div>
                </div>

                <div class="story-flip-hero-row">
                    <div class="story-flip-art-thumb">
                        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.term)}" onerror="this.src='assets/cards/lumi_farmer_strawhat.jpg'" />
                    </div>
                    <div class="story-flip-hero-meta">
                        <div class="story-flip-front-term">${escapeHtml(card.term)}</div>
                        <div class="story-flip-sub-row">
                            <span class="story-flip-pos-chip">${escapeHtml(posLabel)}</span>
                            <button type="button" onclick="event.stopPropagation(); speakAddedStoryCard('${encTerm}')" class="story-flip-audio-pill" title="Nghe phát âm">
                                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                                <span>${hasIpa ? escapeHtml(card.phonetic) : 'Nghe'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="story-flip-prompt-box">
                    <span class="story-flip-prompt-quote">“</span>
                    <p class="story-flip-prompt-text">${highlightTermInSentence(card.example, card.term)}</p>
                </div>

                <div class="story-flip-footer">
                    <span class="story-flip-hint-pill">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        <span>Chạm thẻ để lật mặt sau</span>
                    </span>
                </div>
            </div>

            <div class="story-flippable-face story-flippable-back" style="display: ${st.showingBack ? 'flex' : 'none'}; transform: rotateY(0deg); opacity: 1;">
                <div class="story-flip-header">
                    <span class="story-flip-meaning-label">Mặt sau • Nghĩa &amp; Ngữ cảnh</span>
                    <div class="story-flip-header-right">
                        <span class="story-flip-counter">${idx + 1} / ${total}</span>
                        <button type="button" onclick="event.stopPropagation(); removeAddedStoryCard('${encTerm}')" class="story-flip-icon-btn" title="Xoá khỏi bộ thẻ" aria-label="Xoá thẻ">✕</button>
                    </div>
                </div>

                <div class="story-flip-back-main">
                    <div class="story-flip-back-term-row">
                        <span class="story-flip-back-term">${escapeHtml(card.term)}</span>
                        <button type="button" onclick="event.stopPropagation(); speakAddedStoryCard('${encTerm}')" class="story-flip-audio-pill" title="Nghe phát âm">
                            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                            <span>${hasIpa ? escapeHtml(card.phonetic) : 'Phát âm'}</span>
                        </button>
                    </div>
                    <div class="story-flip-back-meaning">${formatMeaningSpannable(card.meaning)}</div>

                    <div class="story-flip-tabs-bar" onclick="event.stopPropagation()">
                        <button type="button" onclick="event.stopPropagation(); switchStorySavedCardTab('${encTerm}', 'example', ${idx})" class="story-flip-tab-btn ${st.activeTab === 'example' ? 'active' : ''}">Ví dụ truyện</button>
                        <button type="button" onclick="event.stopPropagation(); switchStorySavedCardTab('${encTerm}', 'usage', ${idx})" class="story-flip-tab-btn ${st.activeTab === 'usage' ? 'active' : ''}">Ghi chú</button>
                        <button type="button" onclick="event.stopPropagation(); switchStorySavedCardTab('${encTerm}', 'synonym', ${idx})" class="story-flip-tab-btn ${st.activeTab === 'synonym' ? 'active' : ''}">Đồng nghĩa</button>
                    </div>
                    <div id="storySavedCardTabPanel_${idx}" class="story-flip-tab-panel" onclick="event.stopPropagation()">${renderBackTabInnerHTML(card, st, encTerm)}</div>
                </div>

                <div class="story-flip-footer">
                    <span class="story-flip-hint-pill">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        <span>Chạm thẻ để lật mặt trước</span>
                    </span>
                </div>
            </div>
        </div>`;
    }

    window.flipStorySavedCard = function (idx, encodedTerm) {
        const term = decodeURIComponent(encodedTerm || '').toLowerCase(), st = getCardState(term), container = document.getElementById(`storySavedFlipCard_${idx}`);
        if (st.flipInProgress || !container) return;
        const front = container.querySelector('.story-flippable-front'), back = container.querySelector('.story-flippable-back');
        if (!front || !back) return;
        const outgoing = st.showingBack ? back : front, incoming = st.showingBack ? front : back;
        st.flipInProgress = true;
        if (typeof playFlip === 'function') playFlip(!st.showingBack); else if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(8);
        outgoing.style.transition = 'transform 150ms cubic-bezier(0.4, 0, 1, 1), opacity 150ms ease-in';
        outgoing.style.transform = 'rotateY(90deg)'; outgoing.style.opacity = '0.15';
        setTimeout(() => {
            outgoing.style.display = 'none'; incoming.style.display = 'flex';
            incoming.style.transition = 'none'; incoming.style.transform = 'rotateY(-90deg)'; incoming.style.opacity = '0.15';
            void incoming.offsetWidth;
            incoming.style.transition = 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 240ms ease-out';
            incoming.style.transform = 'rotateY(0deg)'; incoming.style.opacity = '1';
            setTimeout(() => { st.showingBack = !st.showingBack; st.flipInProgress = false; container.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
        }, 150);
    };

    window.switchStorySavedCardTab = function (encodedTerm, tabName, idx) {
        const term = decodeURIComponent(encodedTerm || ''), st = getCardState(term.toLowerCase());
        st.activeTab = tabName;
        const cards = getStoryAddedFlashcards(), card = cards.find(c => c.term.toLowerCase() === term.toLowerCase()), container = document.getElementById(`storySavedFlipCard_${idx}`);
        if (!card || !container) return;
        const btns = container.querySelectorAll('.story-flip-tab-btn');
        ['example', 'usage', 'synonym'].forEach((t, i) => { if (btns[i]) btns[i].classList.toggle('active', t === tabName); });
        const panel = document.getElementById(`storySavedCardTabPanel_${idx}`);
        if (panel) panel.innerHTML = renderBackTabInnerHTML(card, st, encodedTerm);
    };

    window.toggleStorySavedCardExTranslation = function (encodedTerm) {
        const term = decodeURIComponent(encodedTerm || ''), st = getCardState(term.toLowerCase());
        st.showExTr = !st.showExTr;
        const cards = getStoryAddedFlashcards(), idx = cards.findIndex(c => c.term.toLowerCase() === term.toLowerCase()), panel = idx !== -1 ? document.getElementById(`storySavedCardTabPanel_${idx}`) : null;
        if (panel) panel.innerHTML = renderBackTabInnerHTML(cards[idx], st, encodedTerm);
    };

    function renderStoryAddedCardsUI() {
        const cards = getStoryAddedFlashcards(), hasCards = cards.length > 0, state = window.StoryReaderState || {}, latestKey = state.lastAddedFlashcardKey || '';
        const pillBtn = document.getElementById('storyAddedCardsPillBtn'), pillCount = document.getElementById('storyAddedCardsPillCount');
        if (pillBtn && pillCount) { pillCount.textContent = String(cards.length); pillBtn.classList.toggle('hidden', !hasCards); pillBtn.style.display = hasCards ? 'inline-flex' : 'none'; }
        const bookShell = document.getElementById('storyBookShell');
        if (bookShell && !bookShell.__hudScrollBound) {
            bookShell.__hudScrollBound = true;
            let lastScrollY = 0;
            bookShell.addEventListener('scroll', () => {
                const curY = bookShell.scrollTop, heroFrame = document.getElementById('storyHeroFrame');
                if (heroFrame) heroFrame.style.setProperty('--hero-parallax', `${Math.min(28, Math.max(0, curY * 0.18)).toFixed(1)}px`);
                const header = document.getElementById('storyHeroHeader'), actionPill = document.getElementById('storyActionPill'), bottomNav = document.getElementById('storyBottomNav');
                if (curY > 18) {
                    if (header) header.classList.add('story-header-auto-hidden');
                    if (actionPill && !(window.StoryReaderState && window.StoryReaderState.isAudioPlaying)) actionPill.classList.add('story-header-auto-hidden');
                } else window.revealStoryHeroHeaderTemporarily();
                if (bottomNav && !(window.StoryReaderState && window.StoryReaderState.isTargetCardExpanded)) {
                    const isScrollingDown = curY > lastScrollY + 6 && curY > 30, nearBottom = (bookShell.scrollHeight - curY - bookShell.clientHeight) < 80;
                    bottomNav.classList.toggle('story-bottom-nav-hidden', isScrollingDown && !nearBottom);
                }
                lastScrollY = curY;
            }, { passive: true });
        }
        scheduleHeroHeaderAutoHide(1200);
        const sheetList = document.getElementById('storyAddedCardsSheetList'), sheetSubtitle = document.getElementById('storyAddedCardsSheetSubtitle'), sheetReviewBtn = document.getElementById('storyAddedCardsReviewNowBtn');
        if (sheetSubtitle) sheetSubtitle.textContent = hasCards ? `Đã thu thập ${cards.length} thẻ Flashcard 2 mặt • Chạm vào thẻ để lật` : `Chưa có thẻ nào được thêm. Hãy bấm "+ Lưu từ" khi tra để tạo thẻ 2 mặt!`;
        if (sheetReviewBtn) { sheetReviewBtn.style.display = hasCards ? 'flex' : 'none'; sheetReviewBtn.textContent = `Ôn tập ngay ${cards.length} thẻ Flashcard ✨`; }
        if (sheetList) sheetList.innerHTML = hasCards ? cards.map((c, i) => buildAddedCardItemHTML(c, i, cards.length, c.term.toLowerCase() === latestKey)).join('') : `<div class="text-center py-8 px-4 text-[var(--m3-on-surface-variant)] text-[13.5px]">Chưa có thẻ Flashcard nào trong danh sách.</div>`;
    }
    window.renderStoryAddedCardsUI = renderStoryAddedCardsUI;
    window.openStoryAddedCardsModal = () => { renderStoryAddedCardsUI(); const m = document.getElementById('storyAddedCardsModal'); if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; } };
    window.closeStoryAddedCardsModal = (e) => { if (e && e.target && e.target.id !== 'storyAddedCardsModal') return; const m = document.getElementById('storyAddedCardsModal'); if (m) { m.classList.add('hidden'); m.style.display = 'none'; } };
    window.speakAddedStoryCard = (enc) => { const t = decodeURIComponent(enc || ''); if (!t || !('speechSynthesis' in window)) return; try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.95; window.speechSynthesis.speak(u); } catch (e) {} };
    window.removeAddedStoryCard = function (encodedTerm) {
        const term = decodeURIComponent(encodedTerm || ''), key = term.toLowerCase(), state = window.StoryReaderState;
        if (!state) return;
        delete state.wordClassifications[term]; delete cardFlipStates[key];
        if (state.extraVocabularyItems && state.extraVocabularyItems[key]) {
            delete state.extraVocabularyItems[key];
            const currentPart = (state.currentStory.parts || [])[state.currentPartIndex];
            if (currentPart && currentPart.targetWords) currentPart.targetWords = currentPart.targetWords.filter(w => w.term.toLowerCase() !== key);
        }
        if (Array.isArray(state.addedFlashcardsOrder)) state.addedFlashcardsOrder = state.addedFlashcardsOrder.filter(k => k !== key);
        if (window.StoryReaderUI) window.StoryReaderUI.renderTargetWordCard();
        renderStoryAddedCardsUI();
    };
    window.reviewStoryAddedCardsNow = function () {
        const cards = getStoryAddedFlashcards();
        if (cards.length === 0) return;
        window.closeStoryAddedCardsModal();
        const activeVocab = cards.map(c => ({ word: c.term, ipa: c.phonetic, type: POS_VI_MAP[String(c.pos || '').toUpperCase()] || c.pos, meaningVi: c.meaning, meaning: c.meaning, image: c.imageUrl, imageSource: `Truyện • ${c.partTitle}`, example: c.example, exampleTr: c.exampleTr, usage: c.usageNote, synonyms: c.synonyms }));
        if (typeof window.openLessonFlashcardReview === 'function') window.openLessonFlashcardReview({ title: (window.StoryReaderState && window.StoryReaderState.currentStory.title) || 'Thẻ từ truyện đọc', activeVocab, image: cards[0].imageUrl, openDirectReview: true, fromStoryReader: true });
    };
})(window);
