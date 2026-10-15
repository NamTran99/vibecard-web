// ========================================================
// 🎯 LESSON VOCABULARY GOAL SELECTOR COMPONENT
// Module: js/components/lesson/lessonVocabSelector.js
// Ceiling: < 350 lines | Role: Vocabulary Batch Size Picker
// Allows users to choose 5, 10, 15, or All words per lesson
// Dynamic time estimation, stepper controls, and persistence
// ========================================================

(function (window) {
    'use strict';

    let currentTargetCount = 10;
    let isAllSelected = false;
    const STORAGE_KEY = 'vibecard_lesson_target_vocab_count';

    function getSavedVocabCount() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'all') return 'all';
            const num = parseInt(saved, 10);
            return (!isNaN(num) && num >= 3) ? num : 10;
        } catch (e) {
            return 10;
        }
    }

    function calculateEstimatedTime(count) {
        if (count <= 5) return '~3 phút';
        if (count <= 10) return '~5 phút';
        if (count <= 15) return '~8 phút';
        if (count <= 20) return '~10 phút';
        return `~${Math.round(count * 0.55)} phút`;
    }

    function getSubHintText(count, totalAvailable, isAll) {
        if (isAll || count >= totalAvailable) {
            return `Trọn vẹn ${totalAvailable} từ • Nắm chắc 100% nội dung`;
        }
        if (count <= 5) return `Phiên nhanh ${count} từ • Ôn tập nhẹ nhàng`;
        if (count <= 10) return `Tiêu chuẩn ${count} từ • Cân bằng trí nhớ`;
        return `Nâng cao ${count} từ • Mở rộng vốn từ vựng`;
    }

    function initLessonVocabSelector(ch) {
        if (!ch) return;
        const total = (ch.vocab && ch.vocab.length) ? ch.vocab.length : 12;
        const saved = getSavedVocabCount();
        
        if (saved === 'all') {
            isAllSelected = true;
            currentTargetCount = total;
        } else {
            isAllSelected = false;
            currentTargetCount = Math.min(Math.max(3, saved), total);
        }

        updateVocabSelectorUI(ch, currentTargetCount, isAllSelected);
    }

    function setLessonTargetVocabCount(val) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        const ch = window._currentActiveLessonData || (window.lessonIntroData && window.lessonIntroData[window.currentChapterIdx]) || {};
        const total = (ch.vocab && ch.vocab.length) ? ch.vocab.length : 12;

        if (val === 'all') {
            isAllSelected = true;
            currentTargetCount = total;
            try { localStorage.setItem(STORAGE_KEY, 'all'); } catch (e) {}
            updateVocabSelectorUI(ch, currentTargetCount, true);
        } else {
            isAllSelected = false;
            const num = parseInt(val, 10);
            currentTargetCount = Math.min(Math.max(3, num), total);
            try { localStorage.setItem(STORAGE_KEY, currentTargetCount); } catch (e) {}
            updateVocabSelectorUI(ch, currentTargetCount, false);
        }

        if (typeof showDictToast === 'function') {
            const label = val === 'all' ? `Tất cả (${total} từ)` : `${currentTargetCount} từ`;
            showDictToast(`Mục tiêu học: ${label}`);
        }
    }

    function adjustLessonVocabCount(delta) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        const ch = window._currentActiveLessonData || (window.lessonIntroData && window.lessonIntroData[window.currentChapterIdx]) || {};
        const total = (ch.vocab && ch.vocab.length) ? ch.vocab.length : 12;

        let next = (typeof currentTargetCount === 'number' ? currentTargetCount : 10) + delta;
        next = Math.max(3, Math.min(next, total));
        
        currentTargetCount = next;
        isAllSelected = (next >= total);
        try { localStorage.setItem(STORAGE_KEY, isAllSelected ? 'all' : currentTargetCount); } catch (e) {}
        updateVocabSelectorUI(ch, currentTargetCount, isAllSelected);
    }

    function updateVocabSelectorUI(ch, count, isAll) {
        const total = (ch.vocab && ch.vocab.length) ? ch.vocab.length : 12;
        const estTime = calculateEstimatedTime(count);
        window.selectedLessonVocabCount = count;

        // 1. Time Badge & Hints
        const estBadgeEl = document.getElementById('introVocabEstTime');
        const subHintEl = document.getElementById('introVocabSubHint');
        const customCountEl = document.getElementById('introVocabCustomCount');
        if (estBadgeEl) estBadgeEl.textContent = estTime;
        if (subHintEl) subHintEl.textContent = getSubHintText(count, total, isAll);
        if (customCountEl) customCountEl.textContent = isAll ? `Tất cả (${total})` : `${count} từ`;

        // 2. Chip highlight states
        const chips = ['5', '10', '15', 'all'];
        chips.forEach(key => {
            const el = document.getElementById(`vocabChip-${key}`);
            if (!el) return;
            const matches = isAll ? (key === 'all') : (key === String(count));
            if (matches) {
                el.classList.add('is-selected');
                el.setAttribute('aria-pressed', 'true');
            } else {
                el.classList.remove('is-selected');
                el.setAttribute('aria-pressed', 'false');
            }
        });

        // 3. Sync with Action Buttons (Top CTA & Sticky Bottom Dock CTA)
        const durationEl = document.getElementById('introDurationLabel');
        const bottomPrimarySub = document.getElementById('introBottomPrimarySub');
        
        const countLabel = isAll ? `Tất cả ${total} từ` : `${count} từ`;
        if (durationEl) durationEl.textContent = `• ${countLabel} (${estTime})`;
        if (bottomPrimarySub) bottomPrimarySub.textContent = `• ${countLabel} (${estTime})`;

        // 4. Update Vocabulary Highlights list preview
        if (typeof window.renderVocabChips === 'function') {
            window.renderVocabChips(ch, count);
        }
    }

    window.initLessonVocabSelector = initLessonVocabSelector;
    window.setLessonTargetVocabCount = setLessonTargetVocabCount;
    window.adjustLessonVocabCount = adjustLessonVocabCount;
    window.getCurrentTargetVocabCount = () => currentTargetCount;

})(window);
