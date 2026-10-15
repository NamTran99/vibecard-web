// ========================================================
// 📦 FLASHCARD STAGING & DECK CREATION
// Module: js/components/dictionary/dictionaryStaging.js
// Ceiling: < 350 lines | Role: Staging, Selection Toolbar & Card Creation
// ========================================================

(function (window) {
    'use strict';

    window.stagedWords = window.stagedWords || [];
    let isStagedSelectionMode = false;
    let selectedStagedIndices = new Set();

    function updateStagedWordsUI() {
        const count = window.stagedWords ? window.stagedWords.length : 0;
        const badge = document.getElementById('dictStagedCountBadge');
        const floatBar = document.getElementById('dictStagedFloatingBar');
        const summaryText = document.getElementById('dictListSummaryText');

        if (badge) badge.innerText = `${count}`;
        if (summaryText && !isStagedSelectionMode) {
            summaryText.innerText = `Đã gom ${count} từ vựng vào bộ thẻ`;
        }
        if (floatBar) {
            if (count > 0) {
                floatBar.classList.remove('hidden');
                floatBar.classList.remove('opacity-0', 'translate-y-4');
                floatBar.classList.add('opacity-100', 'translate-y-0');
            } else {
                floatBar.classList.add('opacity-0', 'translate-y-4');
                setTimeout(() => floatBar.classList.add('hidden'), 200);
            }
        }
        
        // Ensure list is rendered when UI is updated
        renderStagedWordsList();
    }

    function renderStagedWordsList() {
        const list = document.getElementById('dictStagedCardsContainer');
        const emptyState = document.getElementById('dictStagedEmptyState');
        const addMoreBtn = document.getElementById('dictStagedAddMoreBtn');
        const bottomBar = document.getElementById('dictListBottomBar');
        if (!list) return;
        const words = window.stagedWords || [];

        if (words.length === 0) {
            list.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            if (addMoreBtn) addMoreBtn.classList.add('hidden');
            if (bottomBar) bottomBar.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (addMoreBtn) addMoreBtn.classList.remove('hidden');
        if (bottomBar) bottomBar.classList.remove('hidden');

        list.innerHTML = words.map((item, idx) => {
            const isSelected = selectedStagedIndices.has(idx);
            return `
            <div onclick="${isStagedSelectionMode ? `toggleSelectStagedWord(${idx})` : ''}" class="p-3 rounded-2xl ${isSelected ? 'bg-[#3C4D00]/30 border-[#B8D166]' : 'bg-[#20211C] border-[#46483C]'} border flex items-center justify-between gap-3 mb-2 transition-all cursor-pointer">
                <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    ${isStagedSelectionMode ? `
                        <div class="w-5 h-5 rounded-md border ${isSelected ? 'bg-[#B8D166] border-[#B8D166] text-[#283500]' : 'border-[#46483C] bg-[#141610]'} flex items-center justify-center shrink-0">
                            ${isSelected ? '<svg class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ''}
                        </div>
                    ` : `
                        <span class="w-7 h-7 rounded-xl bg-[#3C4D00] text-[#D4EE7F] font-bold text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
                    `}
                    <div class="min-w-0 flex-1">
                        <span class="text-sm font-black text-[#E5E3DB] truncate block">${item.word}</span>
                        <span class="text-[11px] text-[#C7C8B8] truncate block">${item.meaningVi}</span>
                    </div>
                </div>
                ${!isStagedSelectionMode ? `
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="event.stopPropagation(); removeStagedWord(${idx})" class="w-8 h-8 rounded-full bg-[#252621] hover:bg-rose-500/20 text-[#909283] hover:text-rose-400 flex items-center justify-center transition-all">✕</button>
                    </div>
                ` : ''}
            </div>
            `;
        }).join('');
    }

    function removeStagedWord(idx) {
        if (window.stagedWords && window.stagedWords[idx]) {
            const removed = window.stagedWords.splice(idx, 1);
            selectedStagedIndices.delete(idx);
            updateStagedWordsUI();
            renderStagedWordsList();
            if (typeof showDictToast === 'function') showDictToast(`Đã bỏ "${removed[0]?.word || ''}" khỏi bộ thẻ.`);
        }
    }

    function toggleStagedSelectionMode() {
        if (!window.stagedWords || window.stagedWords.length === 0) return;
        isStagedSelectionMode = !isStagedSelectionMode;
        const btn = document.getElementById('btnToggleSelectStaged');
        const label = document.getElementById('labelSelectStaged');
        const icon = document.getElementById('iconSelectStaged');
        const toolbar = document.getElementById('stagedSelectionToolbar');

        if (isStagedSelectionMode) {
            selectedStagedIndices = new Set(window.stagedWords.map((_, i) => i));
            if (label) label.innerText = 'Xong';
            if (icon) icon.classList.add('hidden');
            if (btn) btn.className = "text-xs font-bold text-[#E5E3DB] px-3 py-1.5 rounded-xl bg-[#252621] border border-[#46483C] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer";
            if (toolbar) toolbar.classList.remove('hidden');
        } else {
            selectedStagedIndices.clear();
            if (label) label.innerText = 'Chọn';
            if (icon) icon.classList.remove('hidden');
            if (btn) btn.className = "text-xs font-bold text-[#D4EE7F] px-3 py-1.5 rounded-xl bg-[#3C4D00] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer";
            if (toolbar) toolbar.classList.add('hidden');
        }

        updateStagedSelectionToolbarUI();
        renderStagedWordsList();
    }

    function toggleSelectStagedWord(idx) {
        if (selectedStagedIndices.has(idx)) {
            selectedStagedIndices.delete(idx);
        } else {
            selectedStagedIndices.add(idx);
        }
        updateStagedSelectionToolbarUI();
        renderStagedWordsList();
    }

    function toggleSelectAllStagedWords() {
        const total = window.stagedWords ? window.stagedWords.length : 0;
        if (selectedStagedIndices.size === total) {
            selectedStagedIndices.clear();
        } else {
            selectedStagedIndices = new Set(window.stagedWords.map((_, i) => i));
        }
        updateStagedSelectionToolbarUI();
        renderStagedWordsList();
    }

    function updateStagedSelectionToolbarUI() {
        const counter = document.getElementById('selectedStagedCounterText');
        const deleteBtn = document.getElementById('btnDeleteSelectedStaged');
        const total = window.stagedWords ? window.stagedWords.length : 0;
        const count = selectedStagedIndices.size;

        if (counter) counter.innerText = `Đã chọn: ${count}/${total}`;
        if (deleteBtn) {
            if (count > 0) {
                deleteBtn.classList.remove('opacity-50', 'pointer-events-none');
            } else {
                deleteBtn.classList.add('opacity-50', 'pointer-events-none');
            }
        }
    }

    function deleteSelectedStagedWords() {
        if (selectedStagedIndices.size === 0) return;
        const count = selectedStagedIndices.size;
        window.stagedWords = window.stagedWords.filter((_, idx) => !selectedStagedIndices.has(idx));
        selectedStagedIndices.clear();
        if (window.stagedWords.length === 0) toggleStagedSelectionMode();
        if (typeof showDictToast === 'function') showDictToast(`Đã xóa ${count} từ khỏi danh sách.`);
        updateStagedWordsUI();
        updateStagedSelectionToolbarUI();
        renderStagedWordsList();
    }

    function clearAllStagedWords() {
        window.stagedWords = [];
        selectedStagedIndices.clear();
        if (isStagedSelectionMode) toggleStagedSelectionMode();
        updateStagedWordsUI();
        renderStagedWordsList();
        if (typeof showDictToast === 'function') showDictToast('Đã làm trống danh sách từ.');
    }

    // Flashcard Creation Workflow
    function instantCreateFlashcards() {
        if (window.currentActiveWord) {
            const word = window.currentActiveWord;
            const exists = window.stagedWords.some(item => item.word.toLowerCase() === word.toLowerCase());
            if (!exists) {
                const data = (window.fullDictData && window.fullDictData[word]) || (window.generateSmartDictEntry ? window.generateSmartDictEntry(word) : { word: word, meaningVi: 'Định nghĩa' });
                window.stagedWords.push({
                    word: data.word,
                    type: data.type || 'adjective',
                    ipa: data.ipa || '',
                    meaningVi: data.meaningVi || 'Định nghĩa từ vựng',
                    image: ''
                });
                updateStagedWordsUI();
            }
        }
        createFlashcardsFromList();
    }

    function createFlashcardsFromList() {
        const modal = document.getElementById('flashcardCreatedModal');
        if (!modal) return;
        const countBadge = document.getElementById('createdModalCardCountBadge');
        const listTitle = document.getElementById('createdModalListTitle');
        const count = window.stagedWords.length || 1;

        if (countBadge) countBadge.innerText = `Đã tạo ${count} thẻ vựng`;
        if (listTitle) listTitle.innerText = `Từ vựng trong bộ (${count})`;

        const unwrapCard = document.getElementById('scratchRewardCard');
        const revealedCard = document.getElementById('revealedRewardCard');
        if (unwrapCard) unwrapCard.classList.remove('hidden');
        if (revealedCard) revealedCard.classList.add('hidden');

        modal.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function triggerCardReveal() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        }
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);

        const unwrapCard = document.getElementById('scratchRewardCard');
        const revealedCard = document.getElementById('revealedRewardCard');
        if (unwrapCard && revealedCard) {
            unwrapCard.classList.add('hidden');
            revealedCard.classList.remove('hidden');
        }
    }

    function closeCreatedModal() {
        const modal = document.getElementById('flashcardCreatedModal');
        if (modal) modal.classList.add('hidden');
        window.stagedWords = [];
        updateStagedWordsUI();
        renderStagedWordsList();
        if (typeof switchDictViewMode === 'function') switchDictViewMode('lookup');
    }

    // Attach to window
    window.updateStagedWordsUI = updateStagedWordsUI;
    window.renderStagedWordsList = renderStagedWordsList;
    window.removeStagedWord = removeStagedWord;
    window.toggleStagedSelectionMode = toggleStagedSelectionMode;
    window.toggleSelectStagedWord = toggleSelectStagedWord;
    window.toggleSelectAllStagedWords = toggleSelectAllStagedWords;
    window.updateStagedSelectionToolbarUI = updateStagedSelectionToolbarUI;
    window.deleteSelectedStagedWords = deleteSelectedStagedWords;
    window.clearAllStagedWords = clearAllStagedWords;
    window.instantCreateFlashcards = instantCreateFlashcards;
    window.createFlashcardsFromList = createFlashcardsFromList;
    window.triggerCardReveal = triggerCardReveal;
    window.closeCreatedModal = closeCreatedModal;

})(window);
