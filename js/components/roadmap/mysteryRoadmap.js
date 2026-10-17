// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP CONTROLLER (mobile-web-pwa V4.0)
// Ceiling: < 350 lines | Story Hook Audio Preview + Popover
// ========================================================

(function (window) {
    'use strict';

    const STORAGE_KEY = 'vibecard_custom_roadmap_slots_v5_sq';
    let mysteryState = { activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} };
    let mysteryListenersBound = false;
    let outsidePopoverBound = false;
    let currentPickingSlot = { chapterId: 0, nodeNum: 3, source: 'classic' };

    const STORY_VOCAB_PREVIEW = {
        topic_001: ['downpour · mưa rào', 'shelter · trú mưa', 'warmth · ấm áp'],
        topic_002: ['badge · thẻ tên', 'keynote · khai mạc', 'mix-up · nhầm lẫn'],
        topic_003: ['steady · bền bỉ', 'pace · nhịp độ', 'boast · khoe khoang'],
        topic_004: ['platform · sân ga', 'delayed · trễ tàu', 'depart · khởi hành'],
        topic_006: ['pebble · viên sỏi', 'thirsty · khát khô', 'clever · mưu trí'],
        topic_007: ['alley · con hẻm', 'broth · nước dùng', 'local · bản xứ'],
        topic_008: ['attic · gác mái', 'seal · niêm phong', 'cipher · mật mã'],
        topic_009: ['shepherd · chăn cừu', 'flock · đàn cừu', 'trust · lòng tin'],
        topic_010: ['clause · điều khoản', 'deadline · hạn chót', 'deal · thương vụ']
    };

    // Mục #3: 1 Câu dẫn mở đầu gợi tò mò + câu phát âm bản xứ khi bấm nút Loa trong Popover
    const STORY_HOOK_PREVIEW = {
        topic_001: { en: 'A sudden downpour brought us under the warm café eaves.', vi: '“Cơn mưa rào bất chợt kéo hai người lạ vào chung mái hiên quán nhỏ…”' },
        topic_002: { en: 'Excuse me, I think we accidentally swapped our name badges.', vi: '“Xin lỗi, hình như chúng ta vừa cầm nhầm thẻ tên của nhau ở quầy lễ tân…”' },
        topic_003: { en: 'Slow and steady wins the race across the spring valley.', vi: '“Chậm mà chắc mới là người chạm đích cuối cùng giữa thung lũng mùa xuân…”' },
        topic_004: { en: 'The midnight train is delayed on platform three.', vi: '“Chuyến tàu nửa đêm vừa báo hoãn giữa sân ga số 3 mờ sương…”' },
        topic_006: { en: 'One pebble at a time, the water began to rise.', vi: '“Từng viên sỏi nhỏ thả xuống, mực nước trong bình từ từ dâng lên…”' },
        topic_007: { en: 'Follow the warm aroma of ramen down the quiet alley.', vi: '“Đi theo hương nước dùng thơm lừng cuối con hẻm nhỏ lúc lên đèn…”' },
        topic_008: { en: 'Under the moonlight, the ancient wax seal finally cracked.', vi: '“Dưới ánh trăng bạc, dấu niêm phong bằng sáp cổ cuối cùng cũng hé mở…”' },
        topic_009: { en: 'Once trust is broken, even the truth sounds hollow.', vi: '“Khi niềm tin đã vơi, lời nói thật cũng hóa tiếng vọng giữa đồi cỏ…”' },
        topic_010: { en: 'We have ten minutes left before the live broadcast begins.', vi: '“Chỉ còn đúng mười phút cuối trước khi đèn báo lên sóng trực tiếp bật sáng…”' }
    };

    const ICON_SPEAKER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';

    function getSlotKey(chapterId, nodeNum) {
        return `${chapterId || 0}_${nodeNum}`;
    }

    function getAssignedStory(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === true) return null;
        return mysteryState.revealedStories[key] || mysteryState.revealedStories[nodeNum] || null;
    }

    function isRoadmapSlotInDeckMode(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === true) return true;
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === false) return false;
        return false;
    }

    function loadSavedState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (parsed && typeof parsed === 'object') {
                mysteryState = Object.assign({ activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} }, parsed);
            }
        } catch (e) {}
    }

    function saveState() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mysteryState)); } catch (e) {}
    }
    loadSavedState();

    function refreshAllRoadmapViews(chapterId = 0) {
        if (typeof window.selectRoadmapChapter === 'function') {
            window.selectRoadmapChapter(chapterId, { keepScroll: true });
        }
        renderMysteryRoadmapTimeline(chapterId);
        if (typeof window.renderRoadmapNextBar === 'function') {
            const ch = (window.roadmapChaptersData && window.roadmapChaptersData[chapterId]) || null;
            window.renderRoadmapNextBar(ch);
        }
    }

    function bindOutsidePopoverClick() {
        if (outsidePopoverBound || typeof document === 'undefined') return;
        outsidePopoverBound = true;
        document.addEventListener('click', (e) => {
            if (!window.__openRoadmapPopoverKey) return;
            if (e.target && e.target.closest && (e.target.closest('.sq-node-anchor') || e.target.closest('.sq-thumb-dock') || e.target.closest('#roadmapGenrePickerSheet'))) return;
            window.__openRoadmapPopoverKey = null;
            const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
            refreshAllRoadmapViews(chIdx);
        });
    }
    bindOutsidePopoverClick();

    function toggleRoadmapNodePopover(nodeNum = 3, chapterId = 0, ev) {
        if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
        const key = getSlotKey(chapterId, nodeNum);
        window.__openRoadmapPopoverKey = (window.__openRoadmapPopoverKey === key) ? null : key;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
        refreshAllRoadmapViews(chapterId);
    }

    function closeRoadmapNodePopover(chapterId = 0) {
        if (!window.__openRoadmapPopoverKey) return;
        window.__openRoadmapPopoverKey = null;
        refreshAllRoadmapViews(chapterId);
    }

    function getQuickFanSuggestions(nodeNum) {
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        const easyList = pool.filter(s => s.difficulty === 'easy');
        const medList = pool.filter(s => s.difficulty === 'medium');
        const hardList = pool.filter(s => s.difficulty === 'hard');
        const pick = (arr, fallbackIdx) => arr.length ? arr[nodeNum % arr.length] : (pool[fallbackIdx] || pool[0]);
        return [pick(easyList, 0), pick(medList, 3), pick(hardList, 6)].filter(Boolean);
    }

    function getStoryVocabChips(story, node) {
        const id = (story && story.id) || (node && node.topicId) || 'topic_003';
        return STORY_VOCAB_PREVIEW[id] || ['context · ngữ cảnh', 'fluency · phản xạ', 'idiom · thành ngữ'];
    }

    function getStoryHookData(story, node) {
        const id = (story && story.id) || (node && node.topicId) || 'topic_003';
        if (STORY_HOOK_PREVIEW[id]) return STORY_HOOK_PREVIEW[id];
        const fallbackVi = (story && story.scenario) || (node && node.scenario) || 'Khám phá tình huống giao tiếp tự nhiên qua câu chuyện.';
        return { en: 'Listen closely to how native speakers handle this moment.', vi: `“${fallbackVi}”` };
    }

    function playStoryHookAudio(encodedEnText, btnEl) {
        const text = decodeURIComponent(encodedEnText || '');
        if (!text) return;
        if (btnEl && btnEl.classList) {
            btnEl.classList.add('is-speaking');
            setTimeout(() => btnEl.classList.remove('is-speaking'), 2400);
        }
        if (typeof window.speechSynthesis !== 'undefined') {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = 'en-US';
                utter.rate = 0.96;
                utter.onend = () => { if (btnEl && btnEl.classList) btnEl.classList.remove('is-speaking'); };
                window.speechSynthesis.speak(utter);
                return;
            } catch (_) {}
        }
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    // Popover chuẩn mobile-web-pwa V4.0 + Câu dẫn mở đầu & Nút Loa nghe thử (#3)
    function renderSquareNodePopover(chapter, node, state, overlaid, customStory, xPct) {
        const chId = chapter.id || 0;
        const num = node.num;
        const shiftPx = xPct < 32 ? 56 : (xPct > 68 ? -56 : 0);
        const arrowShiftPx = -shiftPx;

        if (!overlaid) {
            const trio = getQuickFanSuggestions(num);
            const fanCardsHtml = trio.map((st) => {
                const dMeta = (window.DIFFICULTY_META && window.DIFFICULTY_META[st.difficulty]) || { short: 'Vừa' };
                const safeId = String(st.id).replace(/'/g, "\\'");
                return `
                    <button type="button" class="sq-fan-card" onclick="event.stopPropagation(); pickQuickFanStory(${num}, ${chId}, '${safeId}')">
                        <div class="sq-fan-art-wrap"><img src="${st.img}" alt="" loading="lazy" /></div>
                        <span class="sq-fan-title">${st.title}</span>
                        <span class="sq-fan-meta">• ${dMeta.short}</span>
                    </button>`;
            }).join('');

            return `
                <div class="sq-popover is-fan-picker" style="--pop-shift:${shiftPx}px; --arrow-shift:${arrowShiftPx}px;" onclick="event.stopPropagation()">
                    <span class="sq-popover-arrow"></span>
                    <div class="sq-popover-head">
                        <span class="sq-popover-kicker">Chọn truyện · Chặng ${num}</span>
                        <button type="button" class="sq-pop-ghost-link" onclick="pickRandomForNode(${num}, ${chId})">Ngẫu nhiên</button>
                    </div>
                    <div class="sq-fan-cards-row">${fanCardsHtml}</div>
                    <button type="button" class="sq-pop-sheet-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">
                        <span>Mở kho truyện đầy đủ</span><span aria-hidden="true">›</span>
                    </button>
                </div>`;
        }

        const activeStory = customStory || node;
        const title = activeStory.title || node.title;
        const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
            ? window.resolveRoadmapDifficulty(node, customStory) : { short: 'Vừa' };
        const dur = String((customStory && customStory.duration) || '4 phút');
        const vocabs = getStoryVocabChips(customStory, node);
        const vocabHtml = vocabs.map(v => `<span class="sq-vocab-chip">${v}</span>`).join('');
        const hook = getStoryHookData(customStory, node);
        const encodedEn = encodeURIComponent(hook.en);
        const unlocked = state !== 'locked';

        return `
            <div class="sq-popover is-story-preview" style="--pop-shift:${shiftPx}px; --arrow-shift:${arrowShiftPx}px;" onclick="event.stopPropagation()">
                <span class="sq-popover-arrow"></span>
                <div class="sq-pop-title-row">
                    <div class="sq-pop-title-col">
                        <h4 class="sq-pop-story-title">${title}</h4>
                        <div class="sq-pop-meta-line">${dMeta.short} · ${dur} · +20% Lumi</div>
                    </div>
                    <button type="button" class="sq-audio-preview-btn" onclick="playStoryHookAudio('${encodedEn}', this)" title="Nghe thử câu mở đầu tiếng Anh" aria-label="Nghe thử">
                        ${ICON_SPEAKER}
                    </button>
                </div>
                <p class="sq-story-hook-line">${hook.vi}</p>
                <div class="sq-vocab-row">${vocabHtml}</div>
                <div class="sq-pop-actions">
                    ${unlocked
                        ? `<button type="button" class="sq-pop-start-btn" onclick="launchRevealedLesson(${num}, ${chId})">Bắt đầu học ngay</button>`
                        : `<button type="button" class="sq-pop-start-btn is-locked-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">Đã chọn trước · Chạm để đổi</button>`
                    }
                    <div class="sq-seg-bar">
                        <button type="button" class="sq-seg-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">Đổi truyện khác</button>
                        <span class="sq-seg-div" aria-hidden="true"></span>
                        <button type="button" class="sq-seg-btn is-muted" onclick="resetRoadmapSlotToDeck(${num}, ${chId})">Đặt lại ô ?</button>
                    </div>
                </div>
            </div>`;
    }

    function pickQuickFanStory(nodeNum, chapterId, storyId) {
        currentPickingSlot = { chapterId: chapterId || 0, nodeNum: nodeNum || 3, source: 'classic' };
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        bindStoryToCurrentSlot(pool.find(s => String(s.id) === String(storyId)) || pool[0], true);
    }

    function pickRandomForNode(nodeNum, chapterId) {
        currentPickingSlot = { chapterId: chapterId || 0, nodeNum: nodeNum || 3, source: 'classic' };
        handleRandomStoryPick(true);
    }

    function resetRoadmapSlotToDeck(nodeNum = 3, chapterId = 0) {
        const key = getSlotKey(chapterId, nodeNum);
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[key] = true;
        delete mysteryState.revealedStories[key];
        delete mysteryState.revealedStories[nodeNum];
        window.__openRoadmapPopoverKey = key;
        saveState();
        refreshAllRoadmapViews(chapterId);
        if (typeof showDictToast === 'function') showDictToast(`Đã đặt lại Chặng ${nodeNum} về ô ?`);
    }

    function ensureSheetMountedOnBody() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet && sheet.parentElement !== document.body) document.body.appendChild(sheet);
        return sheet;
    }

    function openMysteryRoadmap() {
        loadSavedState();
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        const classicScreen = document.getElementById('screenParchmentRoadmap');
        if (classicScreen && !classicScreen.classList.contains('hidden')) classicScreen.classList.add('hidden');
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        refreshAllRoadmapViews(chIdx);
        screen.classList.remove('hidden');
        requestAnimationFrame(() => screen.classList.remove('translate-x-full'));
    }

    function closeMysteryRoadmap() {
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        screen.classList.add('translate-x-full');
        setTimeout(() => screen.classList.add('hidden'), 300);
    }

    function switchToClassicRoadmap() {
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        closeMysteryRoadmap();
        setTimeout(() => { if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(chIdx); }, 220);
    }

    function renderMysteryRoadmapTimeline(chapterIdx) {
        const container = document.getElementById('mysteryRoadmapNodesContainer');
        if (!container) return;
        const idx = (typeof chapterIdx === 'number') ? chapterIdx : ((typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[idx]) ? window.roadmapChaptersData[idx] : { id: 0, nodes: [] };
        if (typeof window.buildRoadmapTimelineHtml === 'function') {
            container.innerHTML = window.buildRoadmapTimelineHtml(chapter, { animateIn: true });
            if (typeof window.applyRoadmapFillAnimations === 'function') {
                requestAnimationFrame(() => window.applyRoadmapFillAnimations(container));
            }
        }
    }

    function openRoadmapGenrePickerSheet(nodeNum = 3, chapterId = 0, source = 'classic') {
        currentPickingSlot = { chapterId, nodeNum, source };
        const sheet = ensureSheetMountedOnBody();
        if (!sheet) return;
        const badge = document.getElementById('pickerSheetNodeBadge');
        if (badge) badge.textContent = `Chặng ${nodeNum}`;
        if (typeof window.renderMysteryGenreCardsList === 'function') window.renderMysteryGenreCardsList();
        sheet.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeRoadmapGenrePickerSheet() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet) sheet.classList.add('hidden');
    }

    function bindStoryToCurrentSlot(matchedStory, keepPopoverOpen = true) {
        if (!matchedStory) return;
        closeRoadmapGenrePickerSheet();
        const { chapterId, nodeNum } = currentPickingSlot;
        const key = getSlotKey(chapterId, nodeNum);
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[key] = false;
        mysteryState.revealedStories[key] = { story: matchedStory };
        mysteryState.revealedStories[nodeNum] = { story: matchedStory };
        window.__justRevealedSlot = key;
        window.__openRoadmapPopoverKey = keepPopoverOpen ? key : null;
        setTimeout(() => { if (window.__justRevealedSlot === key) window.__justRevealedSlot = null; }, 1100);
        saveState();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
        refreshAllRoadmapViews(chapterId);
        if (typeof showDictToast === 'function') showDictToast(`Đã chọn "${matchedStory.title}" cho Chặng ${nodeNum}`);
    }

    function handlePickStoryById(storyId) {
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        bindStoryToCurrentSlot(pool.find(s => String(s.id) === String(storyId)) || pool[0], true);
    }

    function handleRandomStoryPick(keepOpen = true) {
        const list = (typeof window.getFilteredStories === 'function' && window.getFilteredStories().length > 0)
            ? window.getFilteredStories() : ((typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : []);
        bindStoryToCurrentSlot(list[Math.floor(Math.random() * list.length)], keepOpen);
    }

    function launchRevealedLesson(nodeNum = 3, chapterId = 0) {
        window.__openRoadmapPopoverKey = null;
        const assigned = getAssignedStory(chapterId, nodeNum);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[chapterId || 0]) || { nodes: [] };
        const fallbackNode = (chapter.nodes || []).find(n => n.num === nodeNum);
        const isCompleted = fallbackNode && fallbackNode.status === 'completed';
        const story = (assigned && assigned.story) ? assigned.story : (isCompleted ? fallbackNode : null);
        if (!story) { openRoadmapGenrePickerSheet(nodeNum, chapterId, 'classic'); return; }
        const lessonPayload = {
            chapterNumber: nodeNum, title: story.title, subtitle: story.subtitle || `Chặng ${nodeNum}`,
            category: `CHẶNG ${nodeNum} • ${story.age || 'TỰ CHỌN'}`, desc: story.scenario,
            image: story.img, thumbnail: story.img, duration: story.duration || '5 phút',
            progressPill: `Chặng ${nodeNum}/10`, progressPercent: nodeNum * 10
        };
        if (typeof window.openStoryReaderScreen === 'function') { window.openStoryReaderScreen(lessonPayload); return; }
        if (typeof window.openLessonIntroScreen === 'function') window.openLessonIntroScreen(chapterId, lessonPayload);
    }

    Object.assign(window, {
        getAssignedRoadmapStory: getAssignedStory, isRoadmapSlotInDeckMode, resetRoadmapSlotToDeck,
        toggleRoadmapNodePopover, closeRoadmapNodePopover, renderSquareNodePopover, playStoryHookAudio,
        pickQuickFanStory, pickRandomForNode,
        renderMysteryRoadmapTimeline, openMysteryRoadmap, closeMysteryRoadmap, switchToClassicRoadmap,
        openRoadmapGenrePickerSheet, closeRoadmapGenrePickerSheet,
        handlePickStoryById, handleRandomStoryPick, handleSelectGenreAndReveal: handleRandomStoryPick, launchRevealedLesson
    });
})(window);
