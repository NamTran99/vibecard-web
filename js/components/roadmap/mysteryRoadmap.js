// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP CONTROLLER (mobile-web-pwa V4.0)
// Ceiling: < 350 lines | Story Hook Audio Preview + Popover
// ========================================================
(function (window) {
    'use strict';
    const STORAGE_KEY = 'vibecard_custom_roadmap_slots_v5_sq';
    let mysteryState = { activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} };
    let outsidePopoverBound = false;
    let currentPickingSlot = { chapterId: 0, nodeNum: 3, source: 'classic' };
    const ICON_SPEAKER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    const ICON_DICE = '<svg class="sq-dice-svg" width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true"><ellipse class="iso-dice-shadow" cx="18" cy="32.5" rx="9.5" ry="2.6" fill="rgba(0,0,0,0.42)"/><g class="iso-dice-body"><path d="M18 4.5L31 12L18 19.5L5 12Z" fill="#FFFDF5" stroke="#F59E0B" stroke-width="1.2" stroke-linejoin="round"/><path d="M5 12L18 19.5L18 31L5 23.5Z" fill="#FDE68A" stroke="#D97706" stroke-width="1.2" stroke-linejoin="round"/><path d="M18 19.5L31 12L31 23.5L18 31Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" stroke-linejoin="round"/><path d="M5.5 12L18 19.2L30.5 12" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/><ellipse class="iso-pip-top" cx="18" cy="12" rx="2.9" ry="1.85" fill="#EF4444"/><ellipse cx="9.5" cy="18.2" rx="1.4" ry="2" transform="rotate(-18 9.5 18.2)" fill="#1E293B"/><ellipse cx="14" cy="23.8" rx="1.4" ry="2" transform="rotate(-18 14 23.8)" fill="#1E293B"/><ellipse cx="22" cy="18.5" rx="1.35" ry="1.9" transform="rotate(18 22 18.5)" fill="#FFFBEB"/><ellipse cx="24.5" cy="21.5" rx="1.35" ry="1.9" transform="rotate(18 24.5 21.5)" fill="#FFFBEB"/><ellipse cx="27" cy="24.5" rx="1.35" ry="1.9" transform="rotate(18 27 24.5)" fill="#FFFBEB"/></g><circle class="iso-dice-spark s1" cx="5" cy="6.5" r="1.4" fill="#FDE047"/><circle class="iso-dice-spark s2" cx="31.5" cy="7.5" r="1.2" fill="#B8D166"/></svg>';
    const ICON_LIBRARY = '<svg class="sq-lib-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>';
    const DICE_3D_FACE_PIPS = [
        '<ellipse cx="40" cy="24" rx="5.2" ry="3.2" fill="#EF4444"/><ellipse cx="22" cy="42" rx="2.6" ry="3.6" transform="rotate(-20 22 42)" fill="#1E293B"/><ellipse cx="31" cy="52" rx="2.6" ry="3.6" transform="rotate(-20 31 52)" fill="#1E293B"/><ellipse cx="49" cy="42" rx="2.5" ry="3.5" transform="rotate(20 49 42)" fill="#FFFBEB"/><ellipse cx="54" cy="47" rx="2.5" ry="3.5" transform="rotate(20 54 47)" fill="#FFFBEB"/><ellipse cx="59" cy="52" rx="2.5" ry="3.5" transform="rotate(20 59 52)" fill="#FFFBEB"/>',
        '<ellipse cx="33" cy="21" rx="3.4" ry="2.1" fill="#1E293B"/><ellipse cx="47" cy="27" rx="3.4" ry="2.1" fill="#1E293B"/><ellipse cx="26" cy="47" rx="3.6" ry="4.8" transform="rotate(-20 26 47)" fill="#EF4444"/><ellipse cx="48" cy="40" rx="2.5" ry="3.5" transform="rotate(20 48 40)" fill="#FFFBEB"/><ellipse cx="59" cy="44" rx="2.5" ry="3.5" transform="rotate(20 59 44)" fill="#FFFBEB"/><ellipse cx="48" cy="53" rx="2.5" ry="3.5" transform="rotate(20 48 53)" fill="#FFFBEB"/><ellipse cx="59" cy="57" rx="2.5" ry="3.5" transform="rotate(20 59 57)" fill="#FFFBEB"/>',
        '<ellipse cx="31" cy="20" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="40" cy="24" rx="3.6" ry="2.2" fill="#EF4444"/><ellipse cx="49" cy="28" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="21" cy="40" rx="2.5" ry="3.4" transform="rotate(-20 21 40)" fill="#1E293B"/><ellipse cx="32" cy="44" rx="2.5" ry="3.4" transform="rotate(-20 32 44)" fill="#1E293B"/><ellipse cx="21" cy="53" rx="2.5" ry="3.4" transform="rotate(-20 21 53)" fill="#1E293B"/><ellipse cx="32" cy="57" rx="2.5" ry="3.4" transform="rotate(-20 32 57)" fill="#1E293B"/><ellipse cx="54" cy="47" rx="3.6" ry="4.8" transform="rotate(20 54 47)" fill="#FFFBEB"/>',
        '<ellipse cx="32" cy="20" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="48" cy="20" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="32" cy="28" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="48" cy="28" rx="3.1" ry="1.9" fill="#1E293B"/><ellipse cx="40" cy="24" rx="3.5" ry="2.2" fill="#EF4444"/><ellipse cx="22" cy="42" rx="2.6" ry="3.6" transform="rotate(-20 22 42)" fill="#1E293B"/><ellipse cx="31" cy="52" rx="2.6" ry="3.6" transform="rotate(-20 31 52)" fill="#1E293B"/><ellipse cx="49" cy="42" rx="2.6" ry="3.6" transform="rotate(20 49 42)" fill="#FFFBEB"/><ellipse cx="58" cy="52" rx="2.6" ry="3.6" transform="rotate(20 58 52)" fill="#FFFBEB"/>',
        '<ellipse cx="31" cy="19" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="40" cy="19" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="49" cy="19" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="31" cy="28" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="40" cy="28" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="49" cy="28" rx="3" ry="1.8" fill="#EF4444"/><ellipse cx="22" cy="41" rx="2.5" ry="3.4" transform="rotate(-20 22 41)" fill="#1E293B"/><ellipse cx="26.5" cy="47.5" rx="2.5" ry="3.4" transform="rotate(-20 26.5 47.5)" fill="#1E293B"/><ellipse cx="31" cy="54" rx="2.5" ry="3.4" transform="rotate(-20 31 54)" fill="#1E293B"/><ellipse cx="54" cy="47" rx="3.6" ry="4.8" transform="rotate(20 54 47)" fill="#FEF08A"/>'
    ];
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
    // Popover chuẩn mobile-web-pwa V4.0 + Xòe thẻ 3D, Quay số Ngẫu nhiên & Nút Loa nghe thử (#3)
    function renderSquareNodePopover(chapter, node, state, overlaid, customStory, xPct) {
        const chId = chapter.id || 0;
        const num = node.num;
        const shiftPx = xPct < 32 ? 56 : (xPct > 68 ? -56 : 0);
        const arrowShiftPx = -shiftPx;
        if (!overlaid) {
            const trio = getQuickFanSuggestions(num);
            const fanCardsHtml = trio.map((st, idx) => {
                const diffKey = st.difficulty || (idx === 0 ? 'easy' : (idx === 1 ? 'medium' : 'hard'));
                const dMeta = (window.DIFFICULTY_META && window.DIFFICULTY_META[diffKey]) || { short: 'Vừa' };
                const safeId = String(st.id).replace(/'/g, "\\'");
                const cv = (typeof window.resolveStoryCharacterVisual === 'function') ? window.resolveStoryCharacterVisual(st, idx) : null;
                const artInner = (cv && cv.svg)
                    ? `<div class="sq-fan-art-wrap is-svg-fan" style="${cv.styleVars}"><div class="sq-fan-svg-rig">${cv.svg}</div><span class="sq-fan-pick-badge">${cv.badge || 'Chọn ✦'}</span></div>`
                    : `<div class="sq-fan-art-wrap"><img src="${st.img}" alt="" loading="lazy" /><span class="sq-fan-pick-badge">Chọn ✦</span></div>`;
                return `<button type="button" class="sq-fan-card diff-${diffKey}" data-story-id="${safeId}" style="--card-i:${idx}" onclick="event.stopPropagation(); pickQuickFanStory(${num}, ${chId}, '${safeId}', this)">${artInner}<span class="sq-fan-title">${st.title}</span><span class="sq-fan-meta"><i class="sq-diff-dot"></i>${dMeta.short}</span></button>`;
            }).join('');
            return `
                <div class="sq-popover is-fan-picker" style="--pop-shift:${shiftPx}px; --arrow-shift:${arrowShiftPx}px;" onclick="event.stopPropagation()">
                    <span class="sq-popover-arrow"></span>
                    <div class="sq-popover-head">
                        <span class="sq-popover-kicker">Chọn truyện</span>
                        <button type="button" class="sq-pop-ghost-link" onclick="pickRandomForNode(${num}, ${chId}, this)">${ICON_DICE}<span class="sq-dice-btn-text">Ngẫu nhiên</span></button>
                    </div>
                    <div class="sq-fan-cards-row">
                        ${fanCardsHtml}
                        <div class="sq-dice-roll-stage" aria-hidden="true">
                            <div class="sq-dice-mover">
                                <div class="sq-dice-shockwave"></div>
                                <div class="sq-dice-sparks"><i>✦</i><i>★</i><i>✦</i><i>•</i><i>★</i><i>✦</i></div>
                                <div class="sq-dice-3d-shadow"></div>
                                <div class="sq-dice-3d-cube">
                                    <svg viewBox="0 0 80 80" class="sq-dice-3d-svg">
                                        <g class="sq-dice-speed-lines" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round" opacity="0.75">
                                            <line x1="4" y1="26" x2="16" y2="26"/><line x1="2" y1="40" x2="12" y2="40"/><line x1="64" y1="24" x2="76" y2="24"/>
                                        </g>
                                        <path d="M40 9L68 24.5L40 40L12 24.5Z" fill="#FFFDF7" stroke="#F59E0B" stroke-width="2.4" stroke-linejoin="round"/>
                                        <path d="M12 24.5L40 40L40 67L12 51.5Z" fill="#FDE68A" stroke="#D97706" stroke-width="2.4" stroke-linejoin="round"/>
                                        <path d="M40 40L68 24.5L68 51.5L40 67Z" fill="#F59E0B" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>
                                        <path d="M13 24.5L40 39.5L67 24.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
                                        <line x1="40" y1="40" x2="40" y2="66" stroke="#FEF08A" stroke-width="1.8" opacity="0.75"/>
                                        <g class="sq-dice-pips-group">${DICE_3D_FACE_PIPS[4]}</g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="sq-pop-sheet-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">
                        <span class="sq-pop-sheet-label">${ICON_LIBRARY}<span>Mở kho truyện đầy đủ</span></span>
                        <span class="sq-pop-sheet-arrow" aria-hidden="true">›</span>
                    </button>
                </div>`;
        }
        const activeStory = customStory || node, title = activeStory.title || node.title;
        const dMeta = (typeof window.resolveRoadmapDifficulty === 'function') ? window.resolveRoadmapDifficulty(node, customStory) : { short: 'Vừa' };
        const dur = String((customStory && customStory.duration) || '4 phút');
        const vocabHtml = getStoryVocabChips(customStory, node).map((v, i) => `<span class="sq-vocab-chip" style="--chip-i:${i}">${v}</span>`).join('');
        const hook = getStoryHookData(customStory, node), encodedEn = encodeURIComponent(hook.en), unlocked = state !== 'locked';
        const startCta = unlocked
            ? `<button type="button" class="sq-pop-start-btn" onclick="launchRevealedLesson(${num}, ${chId})"><span>Bắt đầu học ngay</span></button>`
            : `<button type="button" class="sq-pop-start-btn is-locked-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">Đã chọn trước · Chạm để đổi</button>`;
        return `<div class="sq-popover is-story-preview" style="--pop-shift:${shiftPx}px; --arrow-shift:${arrowShiftPx}px;" onclick="event.stopPropagation()">
            <span class="sq-popover-arrow"></span>
            <div class="sq-pop-title-row"><div class="sq-pop-title-col"><h4 class="sq-pop-story-title">${title}</h4><div class="sq-pop-meta-line">${dMeta.short} · ${dur} · +20% Lumi</div></div><button type="button" class="sq-audio-preview-btn" onclick="playStoryHookAudio('${encodedEn}', this)" title="Nghe thử câu mở đầu tiếng Anh" aria-label="Nghe thử">${ICON_SPEAKER}</button></div>
            <p class="sq-story-hook-line">${hook.vi}</p><div class="sq-vocab-row">${vocabHtml}</div>
            <div class="sq-pop-actions">${startCta}<div class="sq-seg-bar"><button type="button" class="sq-seg-btn" onclick="openRoadmapGenrePickerSheet(${num}, ${chId}, 'classic')">Đổi truyện khác</button><span class="sq-seg-div" aria-hidden="true"></span><button type="button" class="sq-seg-btn is-muted" onclick="resetRoadmapSlotToDeck(${num}, ${chId})">Đặt lại ô ?</button></div></div>
        </div>`;
    }
    function pickQuickFanStory(nodeNum, chapterId, storyId, btnEl) {
        currentPickingSlot = { chapterId: chapterId || 0, nodeNum: nodeNum || 3, source: 'classic' };
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        const chosen = pool.find(s => String(s.id) === String(storyId)) || pool[0];
        if (btnEl && btnEl.classList) { btnEl.classList.add('is-card-chosen'); setTimeout(() => bindStoryToCurrentSlot(chosen, true), 210); return; }
        bindStoryToCurrentSlot(chosen, true);
    }
    function pickRandomForNode(nodeNum, chapterId, btnEl) {
        if (btnEl && btnEl.dataset.rolling === '1') return;
        currentPickingSlot = { chapterId: chapterId || 0, nodeNum: nodeNum || 3, source: 'classic' };
        const pop = btnEl && btnEl.closest ? btnEl.closest('.sq-popover') : null;
        const cards = pop ? Array.from(pop.querySelectorAll('.sq-fan-card')) : [];
        const stage = pop ? pop.querySelector('.sq-dice-roll-stage') : null;
        const pipsEl = stage ? stage.querySelector('.sq-dice-pips-group') : null;
        const labelEl = btnEl ? btnEl.querySelector('.sq-dice-btn-text') : null;
        if (btnEl) { btnEl.dataset.rolling = '1'; btnEl.classList.add('is-rolling'); }
        if (labelEl) labelEl.textContent = 'Đang lắc...';
        if (cards.length === 3) {
            const winIdx = Math.floor(Math.random() * 3);
            const seq = [0, 1, 2, 1, 0, 1, 2, 0, 1, winIdx];
            const delays = [68, 72, 78, 86, 95, 108, 122, 140, 165];
            const xOffsets = [-86, 0, 86];
            if (stage) { stage.classList.remove('is-landed'); stage.classList.add('is-active'); }
            let step = 0;
            const runStep = () => {
                const cIdx = seq[step];
                const isFinal = (step === seq.length - 1);
                if (stage) {
                    stage.style.setProperty('--dice-x', `${xOffsets[cIdx] || 0}px`);
                    stage.style.setProperty('--dice-tilt', `${(step % 2 === 0 ? 1 : -1) * 14}deg`);
                }
                cards.forEach((c, idx) => {
                    c.classList.remove('is-roulette-active', 'is-card-chosen', 'is-card-dimmed');
                    if (isFinal) c.classList.add(idx === cIdx ? 'is-card-chosen' : 'is-card-dimmed');
                    else if (idx === cIdx) c.classList.add('is-roulette-active');
                });
                if (pipsEl) {
                    const faceIdx = isFinal ? 4 : (step % DICE_3D_FACE_PIPS.length);
                    pipsEl.innerHTML = DICE_3D_FACE_PIPS[faceIdx] || DICE_3D_FACE_PIPS[4];
                }
                if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(isFinal ? 4 : 1);
                if (isFinal) {
                    if (stage) stage.classList.add('is-landed');
                    if (labelEl) labelEl.textContent = 'Trúng rồi! ✦';
                    const winCard = cards[cIdx];
                    const badge = winCard && winCard.querySelector('.sq-fan-pick-badge');
                    if (badge) badge.textContent = '🎲 Trúng số!';
                    if (typeof window.confetti === 'function') {
                        try { window.confetti({ particleCount: 32, spread: 64, origin: { y: 0.62 } }); } catch (_) {}
                    }
                    const winId = winCard && winCard.getAttribute('data-story-id');
                    const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
                    const chosen = pool.find(s => String(s.id) === String(winId)) || pool[Math.floor(Math.random() * pool.length)];
                    setTimeout(() => bindStoryToCurrentSlot(chosen, true), 680);
                    return;
                }
                const wait = delays[step] || 105;
                step++;
                setTimeout(runStep, wait);
            };
            runStep();
            return;
        }
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
    function openMysteryRoadmap(chapterIdx) {
        loadSavedState();
        const chIdx = (typeof chapterIdx === 'number') ? chapterIdx : ((typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0);
        if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(chIdx);
    }
    const closeMysteryRoadmap = () => { if (typeof window.closeParchmentRoadmap === 'function') window.closeParchmentRoadmap(); };
    const switchToClassicRoadmap = () => openMysteryRoadmap();
    function renderMysteryRoadmapTimeline() {}
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
    const closeRoadmapGenrePickerSheet = () => { const s = document.getElementById('roadmapGenrePickerSheet'); if (s) s.classList.add('hidden'); };
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
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet && !sheet.classList.contains('hidden')) {
            const ctaBtn = sheet.querySelector('.story-sheet-random-cta');
            if (ctaBtn) ctaBtn.classList.add('is-rolling');
            const rows = Array.from(sheet.querySelectorAll('.story-snap-album, .story-track-row')).slice(0, 7);
            if (rows.length >= 2) {
                let s = 0;
                const timer = setInterval(() => {
                    rows.forEach(r => r.classList.remove('is-sheet-roulette'));
                    rows[s % rows.length].classList.add('is-sheet-roulette');
                    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
                    s++;
                    if (s >= 7) {
                        clearInterval(timer);
                        if (ctaBtn) ctaBtn.classList.remove('is-rolling');
                        if (typeof window.confetti === 'function') { try { window.confetti({ particleCount: 26, spread: 60, origin: { y: 0.7 } }); } catch (_) {} }
                        setTimeout(() => bindStoryToCurrentSlot(list[Math.floor(Math.random() * list.length)], keepOpen), 180);
                    }
                }, 68);
                return;
            }
        }
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
        getCurrentPickingSlot: () => currentPickingSlot,
        toggleRoadmapNodePopover, closeRoadmapNodePopover, renderSquareNodePopover, playStoryHookAudio,
        pickQuickFanStory, pickRandomForNode,
        renderMysteryRoadmapTimeline, openMysteryRoadmap, closeMysteryRoadmap, switchToClassicRoadmap,
        openRoadmapGenrePickerSheet, closeRoadmapGenrePickerSheet,
        handlePickStoryById, handleRandomStoryPick, handleSelectGenreAndReveal: handleRandomStoryPick, launchRevealedLesson
    });
})(window);
