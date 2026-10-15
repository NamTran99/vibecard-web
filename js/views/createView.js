// ========================================================
// 🎨 CREATE STUDIO VIEW (TAB 1) - DUOLINGO/MEMRISE CIRCLE GRID STYLE
// ========================================================

(function(window) {
    'use strict';

    // High fidelity SVG Icons matching user reference screenshot
    const ICONS = {
        // 1. Words and Phrases (Hand planting / seed droplet)
        wordsAndPhrases: `
            <svg viewBox="0 0 32 32" class="w-8 h-8" fill="currentColor">
                <path d="M22 6 C20.5 6 19.2 6.8 18.5 8 L17 12 C16.5 12.8 15.5 13.2 14.5 13 L12.5 12.5 C11.5 12.2 10.5 12.8 10.2 13.8 C10 14.5 10.2 15.2 10.7 15.7 L13 18 C14 19 14.5 20.2 14.5 21.5 L14.5 23 L16.5 23 L16.5 21.5 C16.5 19.8 15.8 18.2 14.5 17 L12.8 15.3 L14 15.5 C15.8 15.8 17.5 15 18.5 13.5 L20.5 9.5 C20.8 8.8 21.5 8.5 22 8.5 C23 8.5 23.8 9.5 23.8 10.5 C23.8 11.2 23.5 11.8 23 12.2 L19.5 15.5 L21 17 L24.5 13.8 C25.5 12.8 26 11.8 26 10.5 C26 8 24.2 6 22 6 Z"/>
                <path d="M15.5 26.5 C14.7 26.5 14 27.2 14 28 C14 29.2 15.5 31 15.5 31 C15.5 31 17 29.2 17 28 C17 27.2 16.3 26.5 15.5 26.5 Z"/>
            </svg>
        `,
        // 2. Feather Quill Pen (Learn Grammar & Review Grammar)
        quill: `
            <svg viewBox="0 0 32 32" class="w-8 h-8" fill="currentColor">
                <path d="M27 4 C27 4 19 5.2 13.5 11.2 C11 14 9.8 17.2 9.5 20.8 L4.5 26.5 L6 27.5 L11.2 22.2 C14.8 21.8 18 20.2 20.8 17.5 C26.8 11.8 28 5 27 4 Z M13 18.5 C12 17 11.5 15.5 12 14 C14 13.5 15.8 14.5 16.5 16.5 C15 17 13.8 17.8 13 18.5 Z"/>
            </svg>
        `,
        // 3. Lightning Bolt (Difficult Words)
        lightning: `
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
            </svg>
        `,
        // 4. Watering Can (Review)
        wateringCan: `
            <svg viewBox="0 0 32 32" class="w-8 h-8" fill="currentColor">
                <path d="M12 13 C9.5 13 7.5 15 7.5 17.5 L7.5 22 C7.5 24 9.5 25.5 12 25.5 L18 25.5 C20.5 25.5 22.5 24 22.5 22 L22.5 17.5 C22.5 15 20.5 13 18 13 Z M17 11 L13 11 C12.4 11 12 10.6 12 10 C12 9.4 12.4 9 13 9 L17 9 C17.6 9 18 9.4 18 10 C18 10.6 17.6 11 17 11 Z"/>
                <path d="M8 17 L3.5 13.5 L2.5 14.8 L7 18.5 Z"/>
                <path d="M2 13 L4 16 L2.2 17.5 L0.5 14.5 Z"/>
                <circle cx="1" cy="20.5" r="0.9"/>
                <circle cx="2.8" cy="22.5" r="0.9"/>
                <path d="M21 15 C23 15 25 16.5 25 19 C25 21.5 23 23 21 23" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
        `,
        // 5. Stopwatch / Speed Review
        stopwatch: `
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor">
                <path d="M12 4a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8zm0 14a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6zm1-10h-2v5l4.2 2.5.8-1.3-3.5-2.1V8zm-2-6h2v2h-2V2z"/>
            </svg>
        `,
        // 6. Video Camera (Learn with Locals)
        videoCamera: `
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor">
                <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4V6.5l-4 4z"/>
            </svg>
        `,
        // 7. Megaphone / Speaker (Listening Skills)
        speaker: `
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        `,
        // 8. Microphone (Pronunciation)
        microphone: `
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
        `,
        // 9. Speaking Head (Responses)
        speakingHead: `
            <svg viewBox="0 0 32 32" class="w-8 h-8" fill="currentColor">
                <path d="M21 7 C16.5 7 13.5 9.8 13.5 14 C13.5 15.5 14 16.8 14.8 17.8 L12.5 19 C12 19.3 11.8 19.8 12 20.3 C12.2 20.8 12.8 21 13.5 21 L15 21 L14 23 L14 25 C14 25.5 14.5 26 15 26 L19 26 C20 26 21 25 21 24 L21 22.5 C23.8 21.5 25.5 18.8 25.5 15.5 C25.5 10.8 23.5 7 21 7 Z"/>
                <path d="M9 13 C8 14.2 8 16.8 9 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M6 11 C4.5 13 4.5 18 6 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
        `
    };

    // Category and Item definitions
    const SECTIONS = [
        {
            title: 'Learn',
            items: [
                {
                    id: 'dict',
                    title: 'Words and Phrases',
                    sub: 'Tra từ & cụm từ',
                    fn: "openDictionaryScreen('')",
                    colorClass: 'circle-bg-primary-olive',
                    icon: ICONS.wordsAndPhrases
                },
                {
                    id: 'text',
                    title: 'Learn Grammar',
                    sub: 'Từ văn bản & ngữ pháp',
                    fn: 'openTextImportDialog()',
                    colorClass: 'circle-bg-primary-lime',
                    icon: ICONS.quill
                },
                { empty: true },
                { empty: true }
            ]
        },
        {
            title: 'Review',
            items: [
                {
                    id: 'ocr',
                    title: 'Difficult Words',
                    sub: 'Quét ảnh OCR từ khó',
                    fn: 'openOcrDialog()',
                    colorClass: 'circle-bg-error-coral',
                    icon: ICONS.lightning
                },
                {
                    id: 'audio',
                    title: 'Review',
                    sub: 'Từ Audio & Video',
                    fn: 'openAudioVideoDialog()',
                    colorClass: 'circle-bg-tertiary-teal',
                    icon: ICONS.wateringCan
                },
                {
                    id: 'speed',
                    title: 'Speed Review',
                    sub: 'Tạo siêu tốc với AI',
                    fn: 'openAiDeckDialog()',
                    colorClass: 'circle-bg-amber-gold',
                    icon: ICONS.stopwatch
                },
                {
                    id: 'lesson',
                    title: 'Review Grammar',
                    sub: 'Từ bài học lộ trình',
                    fn: 'openLessonImportDialog()',
                    colorClass: 'circle-bg-secondary-sage',
                    icon: ICONS.quill
                }
            ]
        },
        {
            title: 'Immerse',
            items: [
                {
                    id: 'locals',
                    title: 'Learn with Locals',
                    sub: 'Video người bản xứ',
                    fn: 'openLocalVideoDialog()',
                    colorClass: 'circle-bg-immerse-teal',
                    icon: ICONS.videoCamera
                },
                {
                    id: 'listen',
                    title: 'Listening Skills',
                    sub: 'Luyện nghe phản xạ',
                    fn: 'openListeningDialog()',
                    colorClass: 'circle-bg-immerse-sage',
                    icon: ICONS.speaker
                },
                { empty: true },
                { empty: true }
            ]
        },
        {
            title: 'Communicate',
            items: [
                {
                    id: 'pronounce',
                    title: 'Pronunciation',
                    sub: 'Luyện phát âm chuẩn IPA',
                    fn: 'openPronunciationDialog()',
                    colorClass: 'circle-bg-comm-primary',
                    icon: ICONS.microphone
                },
                {
                    id: 'response',
                    title: 'Responses',
                    sub: 'Phản xạ hội thoại 1-1',
                    fn: 'openResponsesDialog()',
                    colorClass: 'circle-bg-comm-amber',
                    badge: '2',
                    icon: ICONS.speakingHead
                },
                { empty: true },
                { empty: true }
            ]
        }
    ];

    function renderCircleItem(item) {
        if (item.empty) {
            return `
                <div class="circle-item-card opacity-35 select-none pointer-events-none">
                    <div class="circle-slot-empty"></div>
                    <span class="circle-item-label text-transparent">&nbsp;</span>
                </div>
            `;
        }

        const badgeHtml = item.badge ? `<div class="circle-badge">${item.badge}</div>` : '';

        return `
            <div onclick="${item.fn}" class="circle-item-card" title="${item.sub || item.title}">
                <div class="circle-item-btn ${item.colorClass}">
                    ${item.icon}
                    ${badgeHtml}
                </div>
                <span class="circle-item-label">
                    ${item.title}
                </span>
            </div>
        `;
    }

    function renderCircleGrid() {
        return SECTIONS.map(sec => `
            <div class="mb-8">
                <h3 class="circle-section-title">
                    ${sec.title}
                </h3>
                <div class="circle-grid-4">
                    ${sec.items.map(renderCircleItem).join('')}
                </div>
            </div>
        `).join('');
    }

    function init() {
        const container = document.getElementById('createCircleDynamicContainer');
        if (container) {
            container.innerHTML = renderCircleGrid();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const CreateView = {
        renderCircleGrid,
        init,
        SECTIONS
    };

    window.CreateView = CreateView;

})(window);
