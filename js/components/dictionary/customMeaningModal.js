// ========================================================
// ✍️ CUSTOM MEANING MODAL CONTROLLER
// Module: js/components/dictionary/customMeaningModal.js
// Ceiling: < 220 lines | Role: Manual Vocab & Meaning Editor
// ========================================================

(function (window) {
    'use strict';

    let currentManualSelectedImage = null;

    function openManualMeaningModal(wordOverride, meaningOverride, typeOverride) {
        const modal = document.getElementById('manualMeaningModal');
        if (!modal) return;

        const targetWord = wordOverride || window.currentActiveWord || document.getElementById('fullDictSearchInput')?.value || '';
        const dictData = (typeof fullDictData !== 'undefined') ? fullDictData : {};
        const existingData = dictData[targetWord.toLowerCase()];

        const wordInput = document.getElementById('manualInputWord');
        const meaningInput = document.getElementById('manualInputMeaningVi');
        const typeInput = document.getElementById('manualInputWordType');
        const ipaInput = document.getElementById('manualInputIpa');
        const exEnInput = document.getElementById('manualInputExampleEn');
        const exViInput = document.getElementById('manualInputExampleVi');

        if (wordInput) wordInput.value = targetWord;
        if (meaningInput) meaningInput.value = meaningOverride || (existingData ? existingData.meaningVi : '');
        if (typeInput) typeInput.value = typeOverride || (existingData ? existingData.type : '') || 'Tính từ';

        const staged = window.stagedWords || [];
        const existingStaged = staged.find(item => item.word.toLowerCase() === targetWord.toLowerCase());

        currentManualSelectedImage = existingStaged ? (existingStaged.image || '') : '';
        updateManualImagePreview();

        if (ipaInput) ipaInput.value = existingData ? (existingData.ipa || '') : '';

        const firstEx = existingData && existingData.examples && existingData.examples[0];
        const currentExEn = existingStaged ? (existingStaged.example || '') : '';
        const currentExVi = existingStaged ? (existingStaged.exampleVi || '') : '';

        if (exEnInput) exEnInput.value = currentExEn || (firstEx ? firstEx.en : '');
        if (exViInput) exViInput.value = currentExVi || (firstEx ? firstEx.vi : '');

        modal.classList.remove('hidden');
    }

    function closeManualMeaningModal() {
        const modal = document.getElementById('manualMeaningModal');
        if (modal) modal.classList.add('hidden');
    }

    function updateManualImagePreview() {
        const preview = document.getElementById('manualImagePreview');
        if (!preview) return;
        if (currentManualSelectedImage) {
            preview.style.backgroundImage = `url('${currentManualSelectedImage}')`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
            preview.innerHTML = '';
        } else {
            preview.style.backgroundImage = 'none';
            preview.innerHTML = '🖼️';
        }
    }

    function triggerManualImageSelect() {
        const word = document.getElementById('manualInputWord')?.value || 'resilient';
        if (typeof openMeaningImageModal === 'function') {
            window.currentImageTargetWordIdx = -2; // -2 flag for manual meaning modal
            openMeaningImageModal(-2, 0);
        } else {
            const url = prompt('Nhập đường dẫn ảnh minh họa (URL):');
            if (url && url.trim()) {
                currentManualSelectedImage = url.trim();
                updateManualImagePreview();
            }
        }
    }

    function saveManualMeaning() {
        const wordInput = document.getElementById('manualInputWord')?.value.trim();
        const meaningViInput = document.getElementById('manualInputMeaningVi')?.value.trim();
        const typeInput = document.getElementById('manualInputWordType')?.value.trim() || 'Từ vựng';
        const ipaInput = document.getElementById('manualInputIpa')?.value.trim();
        const exEnInput = document.getElementById('manualInputExampleEn')?.value.trim();
        const exViInput = document.getElementById('manualInputExampleVi')?.value.trim();

        if (!wordInput) {
            if (typeof showDictToast === 'function') showDictToast('Vui lòng nhập từ vựng!');
            return;
        }
        if (!meaningViInput) {
            if (typeof showDictToast === 'function') showDictToast('Vui lòng nhập nghĩa tiếng Việt bạn muốn lưu!');
            return;
        }

        const w = wordInput.toLowerCase();
        window.currentActiveWord = w;

        if (typeof fullDictData !== 'undefined') {
            if (!fullDictData[w]) {
                fullDictData[w] = (typeof generateSmartDictEntry === 'function') ? generateSmartDictEntry(w) : {};
            }
            fullDictData[w].word = wordInput;
            fullDictData[w].meaningVi = meaningViInput;
            fullDictData[w].type = typeInput;
            fullDictData[w].isCustom = true;
            if (ipaInput) fullDictData[w].ipa = ipaInput;
            if (exEnInput) {
                fullDictData[w].examples = [
                    { en: exEnInput, vi: exViInput || 'Ví dụ minh họa' },
                    ...(fullDictData[w].examples || [])
                ];
            }
        }

        if (typeof window.stagedWords === 'undefined') window.stagedWords = [];
        const existingIdx = window.stagedWords.findIndex(item => item.word.toLowerCase() === w);
        const existingObj = existingIdx >= 0 ? window.stagedWords[existingIdx] : {};

        const stagedObj = {
            ...existingObj,
            word: wordInput,
            type: typeInput,
            level: existingObj.level || 'Custom',
            ipa: ipaInput || `/${w}/`,
            meaningVi: meaningViInput,
            example: exEnInput || '',
            exampleVi: exViInput || '',
            image: currentManualSelectedImage || existingObj.image || ''
        };

        if (existingIdx >= 0) {
            window.stagedWords[existingIdx] = stagedObj;
        } else {
            window.stagedWords.push(stagedObj);
        }

        closeManualMeaningModal();
        if (typeof executeFullLookup === 'function') executeFullLookup(wordInput);
        if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
        if (typeof renderStagedWordsList === 'function') renderStagedWordsList();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);

        if (typeof showDictToast === 'function') {
            showDictToast(`✨ Đã lưu nghĩa tự soạn cho "${wordInput}"!`);
        }
    }

    // Attach to window
    window.openManualMeaningModal = openManualMeaningModal;
    window.closeManualMeaningModal = closeManualMeaningModal;
    window.triggerManualImageSelect = triggerManualImageSelect;
    window.updateManualImagePreview = updateManualImagePreview;
    window.saveManualMeaning = saveManualMeaning;

})(window);
