// ========================================================
// 🏷️ LESSON TYPE PICKER MODAL (STORY VS DIALOGUE)
// Module: js/components/lesson/lessonTypePicker.js
// Ceiling: < 350 lines | Role: Type selection bottom sheet
// ========================================================

(function (window) {
    'use strict';

    const LESSON_STATUSES = {
        dialogue: {
            id: 'dialogue',
            label: 'Hội thoại',
            iconSvg: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/></svg>`,
            badgeClass: 'w-6 h-6 rounded-[7px] bg-[#B8D166]/25 border border-[#B8D166]/40 flex items-center justify-center text-[#637A17] dark:text-[#D4EE7F] shadow-sm'
        },
        story: {
            id: 'story',
            label: 'Truyện',
            iconSvg: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
            badgeClass: 'w-6 h-6 rounded-[7px] bg-[#E08738]/25 border border-[#E08738]/40 flex items-center justify-center text-[#B45309] dark:text-[#FBBF24] shadow-sm'
        }
    };

    function updateLessonTypeUI(typeKey) {
        const config = LESSON_STATUSES[typeKey] || LESSON_STATUSES.story;
        const iconContainer = document.getElementById('introStatusIconContainer');
        const breadcrumbEl = document.getElementById('introTopBreadcrumb');

        if (iconContainer) {
            iconContainer.innerHTML = `<div class="${config.badgeClass}">${config.iconSvg}</div>`;
        }
        if (breadcrumbEl) {
            breadcrumbEl.textContent = config.label;
        }
    }

    function toggleLessonType() {
        const data = window.lessonIntroData || [];
        const ch = data[window.currentChapterIdx || 0];
        if (!ch) return;
        const currentType = ch.lessonType === 'dialogue' ? 'dialogue' : 'story';
        const nextType = currentType === 'dialogue' ? 'story' : 'dialogue';
        selectLessonType(nextType);
    }

    function selectLessonType(typeKey) {
        if (!LESSON_STATUSES[typeKey]) return;
        const data = window.lessonIntroData || [];
        const ch = data[window.currentChapterIdx || 0];
        if (ch) {
            ch.lessonType = typeKey;
            ch.breadcrumb = LESSON_STATUSES[typeKey].label;
        }
        updateLessonTypeUI(typeKey);
        updateModalSelectionVisuals(typeKey);

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        setTimeout(() => {
            closeLessonTypePickerModal();
        }, 180);
    }

    function openLessonTypePickerModal() {
        const modal = document.getElementById('modalLessonTypePicker');
        if (!modal) return;
        const data = window.lessonIntroData || [];
        const ch = data[window.currentChapterIdx || 0];
        const currentType = (ch && ch.lessonType === 'dialogue') ? 'dialogue' : 'story';
        updateModalSelectionVisuals(currentType);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeLessonTypePickerModal(e) {
        if (e && e.target !== e.currentTarget && e.currentTarget.id !== 'modalLessonTypePicker') {
            return;
        }
        const modal = document.getElementById('modalLessonTypePicker');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    function updateModalSelectionVisuals(selectedType) {
        const optDialogue = document.getElementById('optionTypeDialogue');
        const optStory = document.getElementById('optionTypeStory');
        const checkDialogue = document.getElementById('checkTypeDialogue');
        const checkStory = document.getElementById('checkTypeStory');

        if (selectedType === 'dialogue') {
            if (optDialogue) {
                optDialogue.className = 'p-3.5 rounded-2xl bg-[#B8D166]/15 dark:bg-[#B8D166]/15 border-2 border-[#B8D166] flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] shadow-sm';
            }
            if (optStory) {
                optStory.className = 'p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-black/[0.05] dark:border-white/10 hover:border-[#E08738]/60 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]';
            }
            if (checkDialogue) checkDialogue.classList.remove('hidden');
            if (checkStory) checkStory.classList.add('hidden');
        } else {
            if (optStory) {
                optStory.className = 'p-3.5 rounded-2xl bg-[#E08738]/15 dark:bg-[#E08738]/15 border-2 border-[#E08738] flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] shadow-sm';
            }
            if (optDialogue) {
                optDialogue.className = 'p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-black/[0.05] dark:border-white/10 hover:border-[#B8D166]/60 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]';
            }
            if (checkStory) checkStory.classList.remove('hidden');
            if (checkDialogue) checkDialogue.classList.add('hidden');
        }
    }

    // Attach to window
    window.LESSON_STATUSES = LESSON_STATUSES;
    window.updateLessonTypeUI = updateLessonTypeUI;
    window.toggleLessonType = toggleLessonType;
    window.selectLessonType = selectLessonType;
    window.openLessonTypePickerModal = openLessonTypePickerModal;
    window.closeLessonTypePickerModal = closeLessonTypePickerModal;
    window.updateModalSelectionVisuals = updateModalSelectionVisuals;

})(window);
