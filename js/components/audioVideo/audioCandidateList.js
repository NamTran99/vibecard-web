// ========================================================
// 📋 AUDIO CANDIDATE WORDS & FLASHCARD CONVERTER
// Module: js/components/audioVideo/audioCandidateList.js
// Ceiling: < 350 lines | Role: Word selection & flashcard export
// ========================================================

(function (window) {
    'use strict';

    function renderStep3Candidates() {
        const step3Container = document.getElementById('audioStep3Container');
        if (!step3Container) return;

        const words = window.demoCandidateWords || [];
        const selectedCount = words.filter(w => w.selected).length;

        let cardsHtml = '';
        words.forEach(word => {
            cardsHtml += `
                <div id="candidate-card-${word.id}" onclick="toggleCandidateSelection('${word.id}')" class="audio-candidate-card w-full p-4 flex flex-col ${word.selected ? 'is-selected' : ''}">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-2.5">
                            <div class="candidate-checkbox">
                                ${word.selected ? '<svg class="w-3.5 h-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                            </div>
                            <h4 class="candidate-term">${word.term}</h4>
                            <span class="candidate-ipa">${word.ipa}</span>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <span class="candidate-level-badge px-2 py-0.5">${word.level}</span>
                            <span class="circle-status-pill ${word.selected ? 'status-primary' : 'status-neutral'}" style="margin: 0; padding: 2px 7px; font-size: 9.5px;">
                                <span class="circle-status-dot"></span>${word.selected ? 'Đã chọn' : 'Chưa chọn'}
                            </span>
                        </div>
                    </div>
                    <p class="candidate-meaning mt-2 mb-1.5 pl-7.5">${word.meaning}</p>
                    <div class="candidate-quote pl-2.5 ml-7.5 my-1 leading-relaxed">
                        "${word.sentence}"
                    </div>
                </div>
            `;
        });

        step3Container.innerHTML = `
            <div class="audio-summary-card w-full p-4 flex items-center justify-between mb-4">
                <div>
                    <h3 class="audio-summary-title">Từ vựng đề xuất từ Audio</h3>
                    <p class="audio-summary-desc mt-0.5">Đã chọn <b id="candidateSelectedCount" class="audio-summary-count font-bold">${selectedCount}</b> / ${words.length} thẻ</p>
                </div>
                <button onclick="toggleSelectAllCandidates()" class="audio-summary-btn px-3 py-1.5 text-[11.5px] font-bold cursor-pointer">
                    Chọn tất cả
                </button>
            </div>

            <div class="flex flex-col gap-3 mb-5">
                ${cardsHtml}
            </div>

            <button onclick="saveSelectedAudioFlashcards()" class="audio-btn-primary w-full h-[52px] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4L12 2z"/></svg>
                <span id="saveFlashcardsBtnText">Tạo ${selectedCount} Flashcards vào Bộ thẻ</span>
            </button>
            <button onclick="goToAudioStep(2)" class="audio-btn-secondary w-full h-[46px] active:scale-[0.98] flex items-center justify-center gap-2 mt-2.5 mb-4 cursor-pointer">
                <span>Quay lại Transcript</span>
            </button>
        `;
    }

    function toggleCandidateSelection(wordId) {
        const words = window.demoCandidateWords || [];
        const item = words.find(w => w.id === wordId);
        if (!item) return;
        item.selected = !item.selected;
        renderStep3Candidates();
    }

    function toggleSelectAllCandidates() {
        const words = window.demoCandidateWords || [];
        const allSelected = words.every(w => w.selected);
        words.forEach(w => w.selected = !allSelected);
        renderStep3Candidates();
    }

    function saveSelectedAudioFlashcards() {
        const words = window.demoCandidateWords || [];
        const selected = words.filter(w => w.selected);
        if (selected.length === 0) {
            if (typeof showEntranceToast === 'function') {
                showEntranceToast('⚠️ Vui lòng chọn ít nhất 1 từ vựng!');
            }
            return;
        }

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        if (typeof closeAudioVideoScreen === 'function') {
            closeAudioVideoScreen();
        }

        setTimeout(() => {
            if (typeof showEntranceToast === 'function') {
                showEntranceToast(`🎉 Đã thêm ${selected.length} thẻ từ Audio vào Bộ từ vựng!`);
            }
        }, 350);
    }

    window.renderStep3Candidates = renderStep3Candidates;
    window.toggleCandidateSelection = toggleCandidateSelection;
    window.toggleSelectAllCandidates = toggleSelectAllCandidates;
    window.saveSelectedAudioFlashcards = saveSelectedAudioFlashcards;

})(window);
