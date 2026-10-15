// ========================================================
// 🎴 REVIEW DECK LOGIC (ANDROID-GRADE 1:1 FLASHCARD SYSTEM)
// Module: js/components/library/reviewDeck.js
// Spec: Matches MainActivityLessonFlashcards.kt 1:1 (< 350 lines)
// ========================================================

(function (window) {
    'use strict';

    let reviewSessionWords = [], currentReviewIndex = 0;
    let isLessonReviewMode = false, isFromStoryReader = false;
    let currentDeckName = 'Mưa Dưới Mái Hiên', currentBackTab = 'example', isExampleTranslationVisible = false;

    function highlightBracketedPrompt(sentence, term) {
        const cleanSent = String(sentence || '').trim(), cleanTerm = String(term || '').trim();
        if (!cleanSent) return `<span class="text-[#16edf6] font-extrabold bg-[#16edf6]/15 px-1.5 py-0.5 rounded">[${cleanTerm.toLowerCase()}]</span>`;
        const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'i');
        if (regex.test(cleanSent)) return cleanSent.replace(regex, '<span class="text-[#16edf6] font-extrabold bg-[#16edf6]/15 px-1.5 py-0.5 rounded">$1</span>');
        return `${cleanSent} <span class="text-[#16edf6] font-extrabold bg-[#16edf6]/15 px-1.5 py-0.5 rounded">[${cleanTerm.toLowerCase()}]</span>`;
    }

    function startReviewFromCreatedModal() {
        const modal = document.getElementById('flashcardCreatedModal');
        if (modal) modal.classList.add('hidden');
        const deckInput = document.getElementById('deckNameInput');
        currentDeckName = (deckInput && deckInput.value.trim()) ? deckInput.value.trim() : 'Bộ thẻ mới';
        isLessonReviewMode = false; isFromStoryReader = false;

        let targetWords = typeof stagedWords !== 'undefined' ? stagedWords : [];
        if (typeof isStagedSelectionMode !== 'undefined' && isStagedSelectionMode && selectedStagedIndices.size > 0) {
            targetWords = stagedWords.filter((_, idx) => selectedStagedIndices.has(idx));
        }
        if (targetWords.length === 0) {
            targetWords = [{ word: 'resilient', type: 'Tính từ', ipa: '/rɪˈzɪl.jənt/', meaningVi: 'Kiên cường, bền bỉ', image: 'assets/cards/lumi_rain_coffee_eaves.jpg' }];
        }

        reviewSessionWords = normalizeFlashcardWords(targetWords);
        currentReviewIndex = 0;
        updateReviewHeaderUI(currentDeckName, reviewSessionWords.length);
        if (typeof stagedWords !== 'undefined') stagedWords = [];
        if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
        if (typeof renderStagedWordsList === 'function') renderStagedWordsList();
        showReviewDeckModal();
        if (typeof showDictToast === 'function') showDictToast(`Đã lưu "${currentDeckName}" (+${targetWords.length * 10} XP)!`);
    }

    function openLessonFlashcardReview(lessonPayload) {
        if (!(lessonPayload && lessonPayload.openDirectReview)) {
            if (typeof window.openStoryReaderScreen === 'function') { window.openStoryReaderScreen(lessonPayload); return; }
            if (typeof openStoryReaderScreen === 'function') { openStoryReaderScreen(lessonPayload); return; }
        }

        const ch = lessonPayload || window._currentActiveLessonData || {};
        currentDeckName = ch.title || currentDeckName || 'Mưa Dưới Mái Hiên';
        isLessonReviewMode = !ch.fromStoryReader;
        isFromStoryReader = Boolean(ch.fromStoryReader);

        let rawVocab = (ch.activeVocab && ch.activeVocab.length > 0) ? ch.activeVocab : (ch.vocab || []);
        if ((!rawVocab || rawVocab.length === 0) && typeof ROADMAP_LESSON_DETAILS !== 'undefined') {
            const key = `${window.currentChapterIdx || 0}_1`;
            if (ROADMAP_LESSON_DETAILS[key] && ROADMAP_LESSON_DETAILS[key].vocab) rawVocab = ROADMAP_LESSON_DETAILS[key].vocab;
            else if (ROADMAP_LESSON_DETAILS['0_1']) rawVocab = ROADMAP_LESSON_DETAILS['0_1'].vocab;
        }

        reviewSessionWords = normalizeFlashcardWords(rawVocab, ch.image || 'assets/cards/lumi_rain_coffee_eaves.jpg');
        window.reviewSessionWords = reviewSessionWords;
        currentReviewIndex = 0;
        updateReviewHeaderUI(currentDeckName, reviewSessionWords.length);
        showReviewDeckModal();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function normalizeFlashcardWords(words, defaultImg = 'assets/cards/lumi_rain_coffee_eaves.jpg') {
        if (!Array.isArray(words) || words.length === 0) {
            return [{
                word: 'resilient', ipa: '/rɪˈzɪl.jənt/', type: 'Tính từ',
                meaningVi: 'Kiên cường, bền bỉ', meaning: 'Kiên cường, bền bỉ', image: defaultImg, imageSource: 'Truyện • Phần 1',
                examples: [{ en: 'She showed a resilient spirit throughout the difficult journey.', vi: 'Cô ấy đã thể hiện một tinh thần kiên cường suốt chặng đường gian khó.' }],
                synonyms: ['tough', 'tenacious', 'strong'],
                usage: 'Tính từ thường đứng trước danh từ hoặc sau to be để ca ngợi sự dẻo dai.'
            }];
        }
        return words.map((v, idx) => {
            const word = v.word || v.term || `Từ ${idx + 1}`, ipa = v.ipa || v.phonetic || '/.../';
            const meaningVi = v.meaningVi || v.meaning || (v.meanings && v.meanings[0] ? v.meanings[0].text : '') || 'Ý nghĩa từ vựng';
            const pos = v.type || v.pos || v.partOfSpeech || 'Từ vựng', cardImg = v.image || v.img || v.imageUrl || defaultImg;
            const examples = (v.examples && Array.isArray(v.examples) && v.examples.length > 0)
                ? v.examples
                : (v.example ? [typeof v.example === 'object' ? v.example : { en: v.example, vi: v.exampleTr || '' }] : []);
            return {
                word, ipa, type: pos, meaningVi, meaning: meaningVi, image: cardImg,
                imageSource: v.imageSource || `Truyện • Phần ${(v.partIndex || 0) + 1}`,
                examples,
                usage: v.usage || v.usageNote || `Từ vựng trọng tâm trong bài "${currentDeckName}".`,
                synonyms: (Array.isArray(v.synonyms) && v.synonyms.length > 0) ? v.synonyms : ['consistent', 'steadfast']
            };
        });
    }

    function updateReviewHeaderUI(title, totalCount) {
        const titleEl = document.getElementById('reviewDeckTitleText'), badgeEl = document.getElementById('reviewDeckCountBadge');
        const progressText = document.getElementById('reviewDeckProgressText'), progressBar = document.getElementById('reviewDeckProgressBar');
        if (titleEl) titleEl.innerText = title;
        if (badgeEl) badgeEl.innerText = `${totalCount} thẻ`;
        if (progressText) progressText.innerText = `1 / ${totalCount} từ`;
        if (progressBar) progressBar.style.width = `${Math.min(100, Math.round((1 / Math.max(1, totalCount)) * 100))}%`;
    }

    function showReviewDeckModal() {
        const deckModal = document.getElementById('reviewDeckModal');
        if (deckModal) { deckModal.classList.remove('hidden', 'opacity-0'); deckModal.style.display = 'flex'; renderCurrentReviewCard(); }
    }

    function closeReviewDeck() {
        const deckModal = document.getElementById('reviewDeckModal');
        if (deckModal) { deckModal.classList.add('hidden', 'opacity-0'); deckModal.style.display = 'none'; }
        if (isFromStoryReader) {
            const storyScreen = document.getElementById('screenStoryReader');
            if (storyScreen) { storyScreen.classList.remove('hidden'); storyScreen.style.display = 'flex'; storyScreen.style.opacity = '1'; }
            return;
        }
        if (isLessonReviewMode) {
            const screen = document.getElementById('screenLessonIntro');
            if (screen) { screen.style.display = ''; screen.classList.remove('hidden', 'translate-x-full'); }
        }
    }

    function toggleActiveCardFlip() {
        const card = document.getElementById('activeReviewCard');
        if (!card) return;
        const toBack = !card.style.transform.includes('rotateY(180deg)');
        if (typeof playFlip === 'function') playFlip(toBack);
        else if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(8);
        card.style.transform = toBack ? 'scale(1.02) rotateY(180deg)' : 'scale(1.02) rotateY(0deg)';
        if (card.children.length >= 2) {
            card.children[0].style.pointerEvents = toBack ? 'none' : 'auto';
            card.children[1].style.pointerEvents = toBack ? 'auto' : 'none';
        }
        setTimeout(() => { card.style.transform = toBack ? 'rotateY(180deg)' : 'rotateY(0deg)'; }, 260);
        if (navigator.vibrate) navigator.vibrate(12);
    }

    function navigateReviewCard(delta) {
        if (!reviewSessionWords || reviewSessionWords.length === 0) return;
        const nextIdx = Math.max(0, Math.min(reviewSessionWords.length - 1, currentReviewIndex + delta));
        if (nextIdx !== currentReviewIndex) {
            currentReviewIndex = nextIdx;
            isExampleTranslationVisible = false;
            renderCurrentReviewCard();
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
        }
    }

    function renderCurrentReviewCard() {
        const container = document.getElementById('reviewDeckContainer'), progressText = document.getElementById('reviewDeckProgressText');
        const progressBar = document.getElementById('reviewDeckProgressBar'), badgeEl = document.getElementById('reviewDeckCountBadge');
        const btnContainer = document.querySelector('#reviewDeckModal > div:last-child');
        if (!container) return;

        if (currentReviewIndex >= reviewSessionWords.length) {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
            container.innerHTML = `
                <div class="text-center animate-fadeIn px-6 max-w-sm">
                    <div class="w-24 h-24 mx-auto rounded-full bg-[#16edf6]/20 border-2 border-[#16edf6]/60 flex items-center justify-center text-5xl mb-6 shadow-[0_0_50px_rgba(22,237,246,0.35)]">🏆</div>
                    <h2 class="text-2xl font-black text-white mb-2">Hoàn thành xuất sắc!</h2>
                    <p class="text-white/70 text-[14px] mb-8 leading-relaxed">Bạn vừa ôn luyện trọn vẹn ${reviewSessionWords.length} thẻ Flashcard 2 mặt trong bài <span class="text-[#16edf6] font-bold">"${currentDeckName}"</span>.</p>
                    <div class="flex flex-col gap-3 w-full">
                        <button type="button" onclick="finishLessonFlashcardReview()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#16edf6] to-[#89ffe0] text-[#07121c] font-black text-[15.5px] active:scale-95 transition-all shadow-[0_6px_25px_rgba(22,237,246,0.35)] cursor-pointer">
                            ${isFromStoryReader ? 'Quay lại truyện đọc' : `Hoàn tất & Về lộ trình (+${reviewSessionWords.length * 10} XP)`}
                        </button>
                        <button type="button" onclick="restartLessonFlashcardReview()" class="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold text-[14px] active:scale-95 transition-all cursor-pointer">↺ Ôn lại bộ thẻ này</button>
                    </div>
                </div>`;
            if (progressText) progressText.innerText = `${reviewSessionWords.length} / ${reviewSessionWords.length} từ`;
            if (progressBar) progressBar.style.width = '100%';
            if (btnContainer) btnContainer.style.display = 'none';
            return;
        }

        if (btnContainer) btnContainer.style.display = 'flex';
        const item = reviewSessionWords[currentReviewIndex], total = reviewSessionWords.length, currentPos = currentReviewIndex + 1;
        const cardImg = item.image || 'assets/cards/lumi_rain_coffee_eaves.jpg';
        const promptSentence = (item.examples && item.examples[0] && item.examples[0].en) ? item.examples[0].en : `So, how's the [${item.word.toLowerCase()}] been since you moved back?`;

        if (progressText) progressText.innerText = `${currentPos} / ${total} từ`;
        if (progressBar) progressBar.style.width = `${Math.min(100, Math.round((currentPos / total) * 100))}%`;
        if (badgeEl) badgeEl.innerText = `${total} thẻ`;

        const prevFab = document.getElementById('reviewNavPrevFab'), nextFab = document.getElementById('reviewNavNextFab');
        if (prevFab) { const can = currentReviewIndex > 0; prevFab.style.opacity = can ? '1' : '0.3'; prevFab.style.pointerEvents = can ? 'auto' : 'none'; }
        if (nextFab) { const can = currentReviewIndex < total - 1; nextFab.style.opacity = can ? '1' : '0.3'; nextFab.style.pointerEvents = can ? 'auto' : 'none'; }

        const dotsRow = document.getElementById('reviewDeckDotsRow');
        if (dotsRow) {
            dotsRow.innerHTML = Array.from({ length: total }).map((_, i) => `<span style="display:inline-block; height:7px; border-radius:9999px; transition:all 0.25s ease; ${i === currentReviewIndex ? 'width:32px; background:#16EDF6; opacity:1;' : 'width:7px; background:rgba(150,159,177,0.45); opacity:0.55;'}"></span>`).join('');
        }

        container.innerHTML = `
            <div id="activeReviewCard" onclick="if(!event.target.closest('button, a, input, select, textarea, .card-tab-content-box, [onclick*=\\'stopPropagation\\']')) toggleActiveCardFlip();">
                <!-- 🎴 FRONT FACE (1:1 Android flashcardFrontFace) -->
                <div class="flashcard-face-front">
                    <div class="w-full flex items-center justify-between z-10">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider border border-[#16edf6]/40 bg-[#16edf6]/15 text-[#16edf6]">CẤP 1 • MỚI HỌC</span>
                        <span class="text-white/60 font-mono text-[11.5px] font-bold">${currentPos}/${total}</span>
                    </div>
                    <div class="w-full flex flex-col items-center text-center mt-1 z-10">
                        <h2 class="text-[30px] font-black tracking-tight text-[#16edf6] drop-shadow-[0_0_18px_rgba(22,237,246,0.45)] leading-tight">${item.word.toLowerCase()}</h2>
                        <span class="mt-1.5 px-3.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#16edf6]/15 text-[#8bf8ff] border border-[#68f6ff]/40">${item.type || 'Word'}</span>
                    </div>
                    <div class="flashcard-story-preview my-2 z-10 shadow-lg rounded-[18px] overflow-hidden border border-[#16edf6]/30 relative" style="height: 102px; width: 100%;">
                        <img src="${cardImg}" alt="${item.word}" class="w-full h-full object-cover" onerror="this.src='assets/cards/lumi_rain_coffee_eaves.jpg'" />
                        <span class="absolute left-2.5 bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#ecf7fc] bg-[#06141e]/80 border border-white/25">${item.imageSource || 'Truyện đọc'}</span>
                    </div>
                    <div class="flashcard-prompt-box w-full z-10 text-[13px] font-bold text-[#c6d3da] leading-snug">${highlightBracketedPrompt(promptSentence, item.word)}</div>
                    <div class="flex flex-col items-center gap-1 mt-auto pt-1.5 pointer-events-none z-10">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center bg-[#0a303d] border border-[#16edf6]/50 shadow-[0_0_12px_rgba(22,237,246,0.35)]">
                            <svg class="w-4.5 h-4.5 text-[#16edf6]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        </div>
                        <span class="text-[10px] font-black tracking-[0.14em] text-[#68f6ff]">CHẠM ĐỂ LẬT</span>
                    </div>
                </div>

                <!-- 🎴 BACK FACE (1:1 Android flashcardBackFace) -->
                <div class="flashcard-face-back">
                    <div class="w-full flex items-center justify-between z-10">
                        <span class="text-[10px] font-extrabold tracking-widest text-[#e5b2ff]">MEANING</span>
                        <span class="text-white/60 font-mono text-[11.5px] font-bold">${currentPos}/${total}</span>
                    </div>
                    <div class="w-full text-center mt-1 z-10"><span class="text-[20px] font-bold text-[#e8eafc]">${item.word.toLowerCase()}</span></div>
                    <div class="w-full text-center my-1 z-10 px-2"><h3 class="text-[23px] font-black leading-tight text-[#45ecf4] drop-shadow-[0_0_12px_rgba(69,236,244,0.35)]">${item.meaningVi || item.meaning}</h3></div>
                    <div class="w-full flex justify-center my-1 z-10">
                        <button type="button" onclick="event.stopPropagation(); speakWord('${item.word.replace(/'/g, "\\'")}');" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer bg-[#16edf6]/15 border border-[#16edf6]/40 text-[#5deef7]">
                            <svg class="w-4 h-4 text-[#16edf6]" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z"/></svg>
                            <span class="text-[12.5px] font-bold font-mono">${item.ipa || '/.../'}</span>
                        </button>
                    </div>
                    <div class="w-full flex items-center justify-center gap-1.5 py-1 my-1 select-none z-10" onclick="event.stopPropagation();">
                        <button type="button" onclick="switchReviewBackTab('example')" id="reviewTabBtn_example" class="px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${currentBackTab === 'example' ? 'bg-[#16edf6] text-[#08191e]' : 'bg-[#22243d] text-[#c2c9db]'}">Ví dụ</button>
                        <button type="button" onclick="switchReviewBackTab('usage')" id="reviewTabBtn_usage" class="px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${currentBackTab === 'usage' ? 'bg-[#16edf6] text-[#08191e]' : 'bg-[#22243d] text-[#c2c9db]'}">Cách sử dụng</button>
                        <button type="button" onclick="switchReviewBackTab('synonym')" id="reviewTabBtn_synonym" class="px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${currentBackTab === 'synonym' ? 'bg-[#16edf6] text-[#08191e]' : 'bg-[#22243d] text-[#c2c9db]'}">Đồng nghĩa</button>
                    </div>
                    <div id="flashcardBackTabContent" class="card-tab-content-box flex-1 min-h-[96px] p-3.5 rounded-2xl bg-[#0f1125] border border-[#2b2f52] flex flex-col justify-center items-center text-center relative overflow-hidden z-10" onclick="event.stopPropagation();">
                        ${renderBackTabContent(item, currentBackTab)}
                    </div>
                </div>
            </div>`;
        const cardEl = document.getElementById('activeReviewCard');
        if (cardEl) initCardTouchSwipe(cardEl);
    }

    function switchReviewBackTab(tabName) {
        currentBackTab = tabName;
        const item = reviewSessionWords[currentReviewIndex], contentBox = document.getElementById('flashcardBackTabContent');
        if (contentBox && item) contentBox.innerHTML = renderBackTabContent(item, tabName);
        ['example', 'usage', 'synonym'].forEach(t => {
            const btn = document.getElementById(`reviewTabBtn_${t}`);
            if (btn) btn.className = `px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${t === tabName ? 'bg-[#16edf6] text-[#08191e]' : 'bg-[#22243d] text-[#c2c9db]'}`;
        });
    }

    function toggleExampleTranslation() {
        isExampleTranslationVisible = !isExampleTranslationVisible;
        const item = reviewSessionWords[currentReviewIndex], contentBox = document.getElementById('flashcardBackTabContent');
        if (contentBox && item) contentBox.innerHTML = renderBackTabContent(item, 'example');
    }

    function renderBackTabContent(item, tab) {
        if (tab === 'usage') return `<div class="w-full flex flex-col items-center justify-center gap-1"><span class="text-[10px] font-extrabold text-[#d2b1ec] uppercase tracking-wider">Cách sử dụng</span><p class="text-[12.5px] font-semibold text-[#bbc7d6] leading-relaxed px-2">${item.usage || 'Sử dụng tự nhiên trong giao tiếp và câu chuyện.'}</p></div>`;
        if (tab === 'synonym') {
            const list = (item.synonyms && item.synonyms.length > 0) ? item.synonyms : ['consistent', 'steadfast'];
            return `<div class="w-full flex flex-wrap items-center justify-center gap-2 p-1">${list.map(s => `<button type="button" onclick="speakWord('${s.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-full bg-[#181a33] border border-[#3b3e66] text-[#5deef7] text-[12px] font-bold underline underline-offset-2 cursor-pointer">${s}</button>`).join('')}</div>`;
        }
        const ex = (item.examples && item.examples[0]) ? item.examples[0] : { en: `They used "${item.word}" in conversation.`, vi: '' };
        const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const highlighted = (ex.en || '').replace(new RegExp(`(${escaped})`, 'gi'), '<span class="text-[#16edf6] font-extrabold bg-[#16edf6]/15 px-1 rounded">$1</span>');
        return `<div class="w-full flex flex-col items-center justify-center gap-1.5 cursor-pointer" onclick="toggleExampleTranslation()">
            <p class="text-[14px] font-bold text-[#e7ebf6] leading-relaxed px-1">${highlighted}</p>
            ${isExampleTranslationVisible && ex.vi ? `<p class="text-[12.5px] text-[#bbc7d6] font-semibold leading-snug animate-fadeIn px-1 mt-1">${ex.vi}</p>` : ''}
            <span class="text-[11px] font-bold text-[#8e97ac] mt-1">${isExampleTranslationVisible ? 'Chạm để ẩn bản dịch' : 'Chạm để xem bản dịch'}</span>
        </div>`;
    }

    function initCardTouchSwipe(cardEl) {
        let startX = 0, startY = 0, currentX = 0, isDragging = false;
        cardEl.addEventListener('touchstart', (e) => {
            if (e.target.closest('button, a, input, select, textarea, .card-tab-content-box')) return;
            startX = e.touches[0].clientX; startY = e.touches[0].clientY; currentX = startX; isDragging = true; cardEl.style.transition = 'none';
        }, { passive: true });
        cardEl.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX, deltaY = e.touches[0].clientY - startY;
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                const isFlipped = cardEl.style.transform.includes('rotateY(180deg)');
                cardEl.style.transform = `translateX(${deltaX}px) rotate(${(deltaX / 300) * 15}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`;
            }
        }, { passive: true });
        cardEl.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const deltaX = currentX - startX;
            if (deltaX > 70) swipeCard('right');
            else if (deltaX < -70) swipeCard('left');
            else {
                cardEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                cardEl.style.transform = cardEl.style.transform.includes('rotateY(180deg)') ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
        }, { passive: true });
    }

    function swipeCard(direction) {
        const cardEl = document.getElementById('activeReviewCard');
        if (!cardEl) return;
        if (navigator.vibrate) navigator.vibrate(20);
        const dx = (direction === 'left') ? -320 : 320, rotate = (direction === 'left') ? -18 : 18;
        if (direction === 'left') {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            if (reviewSessionWords[currentReviewIndex]) reviewSessionWords.push(reviewSessionWords[currentReviewIndex]);
        } else if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
        cardEl.style.transition = 'all 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cardEl.style.transform = `translate(${dx}px, 0px) rotate(${rotate}deg) scale(0.9)`;
        cardEl.style.opacity = '0';
        setTimeout(() => { currentReviewIndex++; isExampleTranslationVisible = false; renderCurrentReviewCard(); }, 260);
    }

    function finishLessonFlashcardReview() {
        closeReviewDeck();
        if (!isFromStoryReader && typeof advanceRoadmapProgress === 'function') advanceRoadmapProgress();
        if (typeof showDictToast === 'function') showDictToast(`🎉 Hoàn thành ôn tập! Nhận +${reviewSessionWords.length * 10} XP!`);
    }

    function restartLessonFlashcardReview() { currentReviewIndex = 0; renderCurrentReviewCard(); }

    window.startReviewFromCreatedModal = startReviewFromCreatedModal;
    window.openReviewDeckModal = startReviewFromCreatedModal;
    window.openLessonFlashcardReview = openLessonFlashcardReview;
    window.closeReviewDeck = closeReviewDeck;
    window.toggleActiveCardFlip = toggleActiveCardFlip;
    window.navigateReviewCard = navigateReviewCard;
    window.swipeCard = swipeCard;
    window.switchReviewBackTab = switchReviewBackTab;
    window.toggleExampleTranslation = toggleExampleTranslation;
    window.renderCurrentReviewCard = renderCurrentReviewCard;
    window.finishLessonFlashcardReview = finishLessonFlashcardReview;
    window.restartLessonFlashcardReview = restartLessonFlashcardReview;
})(window);