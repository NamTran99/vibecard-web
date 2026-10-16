// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP CONTROLLER (DYNAMIC STORY SLOTS v4.0)
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    const ICON_SPARKLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10z"/></svg>';
    const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>';
    const ICON_PLAY = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.34-5.89a1.5 1.5 0 000-2.54L6.3 2.84z"/></svg>';

    const STORAGE_KEY = 'vibecard_custom_roadmap_slots_v4';
    let mysteryState = { activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} };
    let mysteryListenersBound = false;
    let currentPickingSlot = { chapterId: 0, nodeNum: 3, source: 'classic' };

    function getSlotKey(chapterId, nodeNum) { return `${chapterId || 0}_${nodeNum}`; }
    function getAssignedStory(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key]) return null;
        return mysteryState.revealedStories[key] || mysteryState.revealedStories[nodeNum] || null;
    }
    function isRoadmapSlotInDeckMode(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === true) return true;
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === false) return false;
        return !getAssignedStory(chapterId, nodeNum);
    }

    function loadSavedState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (parsed && typeof parsed === 'object') mysteryState = Object.assign({ activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} }, parsed);
        } catch (e) {}
    }
    function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mysteryState)); } catch (e) {} }
    loadSavedState();

    function resetRoadmapSlotToDeck(nodeNum = 3, chapterId = 0) {
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[getSlotKey(chapterId, nodeNum)] = true;
        saveState();
        if (typeof window.selectRoadmapChapter === 'function') window.selectRoadmapChapter(chapterId, { keepScroll: true });
        else renderMysteryRoadmapTimeline(chapterId);
        if (typeof showDictToast === 'function') showDictToast(`🃏 Đã úp bộ bài Chặng ${nodeNum} — chạm để rút câu chuyện mới!`);
    }

    function ensureSheetMountedOnBody() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet && sheet.parentElement !== document.body) document.body.appendChild(sheet);
        return sheet;
    }

    function bindMysteryScrollListener() {
        if (mysteryListenersBound) return;
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        if (!scrollArea) return;
        mysteryListenersBound = true;
        let lastY = 0;
        scrollArea.addEventListener('scroll', () => {
            const y = scrollArea.scrollTop;
            const heroBox = document.getElementById('mysteryHeroContentBox');
            if (heroBox) {
                const fade = Math.max(0, Math.min(1, 1 - Math.max(0, y - 8) / 72));
                heroBox.style.opacity = String(fade);
                heroBox.style.pointerEvents = fade < 0.15 ? 'none' : 'auto';
                heroBox.style.transform = `translateY(${Math.min(12, Math.max(0, (y - 8) * 0.15)).toFixed(1)}px)`;
            }
            if (topBar) {
                if (y > 90) topBar.classList.add('is-scrolled');
                else if (y < 76) topBar.classList.remove('is-scrolled');
            }
            const nextBar = document.getElementById('mysteryRoadmapNextBar'), dy = y - lastY;
            if (nextBar) {
                if (dy > 12 && y > 60) nextBar.classList.add('is-hidden-scroll');
                else if (dy < -12) nextBar.classList.remove('is-hidden-scroll');
            }
            lastY = y;
        }, { passive: true });
    }

    function openMysteryRoadmap() {
        loadSavedState();
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        const classicScreen = document.getElementById('screenParchmentRoadmap');
        if (classicScreen && !classicScreen.classList.contains('hidden')) classicScreen.classList.add('hidden');
        bindMysteryScrollListener();
        renderMysteryAmbientRain();
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        if (typeof window.selectRoadmapChapter === 'function') window.selectRoadmapChapter(chIdx, { keepScroll: true });
        else renderMysteryRoadmapTimeline(chIdx);
        screen.classList.remove('hidden');
        requestAnimationFrame(() => screen.classList.remove('translate-x-full'));
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        const heroBox = document.getElementById('mysteryHeroContentBox');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (topBar) topBar.classList.remove('is-scrolled');
        if (heroBox) { heroBox.style.opacity = '1'; heroBox.style.pointerEvents = 'auto'; heroBox.style.transform = 'translateY(0)'; }
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeMysteryRoadmap() {
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        screen.classList.add('translate-x-full');
        setTimeout(() => {
            screen.classList.add('hidden');
            const topBar = document.getElementById('mysteryRoadmapTopBar');
            if (topBar) topBar.classList.remove('is-scrolled');
        }, 300);
    }

    function switchToClassicRoadmap() {
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        closeMysteryRoadmap();
        setTimeout(() => { if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(chIdx); }, 220);
    }

    function renderMysteryAmbientRain() {
        const container = document.getElementById('mysteryAmbientContainer');
        if (!container) return;
        container.innerHTML = Array.from({ length: 16 }, () => `<div class="ambient-rain-drop" style="left:${(Math.random() * 100).toFixed(1)}%; top:${(Math.random() * -80).toFixed(0)}px; animation-duration:${(0.85 + Math.random() * 0.65).toFixed(2)}s; animation-delay:${(Math.random() * 2).toFixed(2)}s;"></div>`).join('');
    }

    function renderMysteryCompletedCard(node, chapterId) {
        const assigned = getAssignedStory(chapterId, node.num), story = assigned ? assigned.story : null;
        const title = story ? story.title : node.title, img = story ? story.img : node.img;
        const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
            ? window.resolveRoadmapDifficulty(node, story)
            : { short: 'Dễ', badgeCls: 'age-badge-3' };
        return `<div class="rm-done-card" onclick="launchRevealedLesson(${node.num}, ${chapterId})" role="button" tabindex="0">
            <div class="rm-done-thumb"><img src="${img}" alt="${title}" loading="lazy" /><span class="rm-done-check">✓</span></div>
            <div class="rm-done-info">
                <div class="rm-done-top"><span class="rm-done-step">Chặng ${node.num}</span><span class="rm-completed-stars" aria-label="3 sao">★★★</span></div>
                <h4 class="rm-done-title">${title}</h4>
                <span class="age-badge ${dMeta.badgeCls} rm-done-diff">${dMeta.short}</span>
            </div>
        </div>`;
    }

    function renderMysteryRoadmapTimeline(chapterIdx) {
        const container = document.getElementById('mysteryRoadmapNodesContainer');
        if (!container) return;
        const idx = (typeof chapterIdx === 'number') ? chapterIdx : ((typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[idx]) ? window.roadmapChaptersData[idx] : { id: 0, nodes: [] };
        const nodes = chapter.nodes || [];
        const cleanMascots = [
            { name: 'Thần Rừng Lumi', img: 'assets/create/lumi_fox.png', quote: 'Học xong 3 bài nữa là Lumi sáng rực 100% và mở Rương +150 XP!' },
            { name: 'Lumi Nhà Thám Hiểm', img: 'assets/library/lumi_reading_fox.webp', quote: 'Cố lên! Phần cuối sẽ mở ra kho báu và thử thách trùm cuối!' }
        ];
        const titlesMap = (typeof window.roadmapSectionTitles !== 'undefined' && window.roadmapSectionTitles[chapter.id]) || ['Trú mưa dưới hiên', 'Bước ra màn đêm'];
        const perLoop = 5, loops = Math.ceil(nodes.length / perLoop);
        let timelineHtml = '<div class="mb-timeline rm-clean-stage mb-animate-in">';

        for (let loop = 0; loop < loops; loop++) {
            const sectionNodes = nodes.slice(loop * perLoop, (loop + 1) * perLoop);
            const completedCount = sectionNodes.filter(n => n.status === 'completed').length;
            const started = completedCount > 0 || sectionNodes.some(n => n.status === 'active');
            const fillPct = Math.min(100, completedCount * 20), mastered = fillPct >= 100;
            const showWave = fillPct > 0 && fillPct < 100;
            const char = cleanMascots[loop] || cleanMascots[0];
            const segments = Array.from({ length: perLoop }, (_, i) => `<span class="${i < completedCount ? 'on' : ''}"></span>`).join('');
            const pctLabel = mastered ? '✨ 100%' : (started ? `⚡ ${fillPct}%` : '🔒 0%');
            const rewardIcon = loop === 0 ? '🎁' : '👑';
            const secTitle = titlesMap[loop] || `Phần ${loop + 1}`;

            timelineHtml += `<section class="mb-section" data-loop="${loop + 1}">`;
            if (started || loop === 0) {
                timelineHtml += `
                    <div class="mb-row mb-head-row">
                        <div class="mb-head">
                            <div class="mb-head-text">
                                <span class="mb-head-eyebrow">ĐỒNG HÀNH CÙNG LUMI</span>
                                <h3 class="mb-head-title">${secTitle}</h3>
                                <div class="mb-segbar-row">
                                    <div class="mb-segbar ${mastered ? 'is-mastered' : ''}">${segments}</div>
                                    <span class="mb-segbar-arrow" aria-hidden="true">→</span>
                                    <span class="mb-segbar-chest ${mastered ? 'is-unlocked' : ''}">${rewardIcon}</span>
                                </div>
                            </div>
                            <div class="mb-char ${mastered ? 'is-mastered' : ''} ${started ? '' : 'is-waiting'}" onclick="if(typeof handleCharacterTap==='function') handleCharacterTap(this);">
                                <div class="mb-char-bubble">${char.quote}</div><div class="mb-char-shadow"></div>
                                <img class="mb-char-gray" src="${char.img}" alt="" />
                                <img class="mb-char-color" src="${char.img}" alt="" style="clip-path: inset(${100 - fillPct}% 0 0 0);" />
                                <div class="mb-char-line" style="bottom: calc(${fillPct}% - 1px); opacity: ${showWave ? 1 : 0};"></div>
                                <span class="mb-char-pct-pill ${mastered ? 'is-mastered' : ''}">${pctLabel}</span>
                            </div>
                        </div>
                    </div>`;
            } else {
                timelineHtml += `
                    <div class="rm-stage-divider">
                        <span class="rm-stage-divider-line"></span>
                        <span class="rm-stage-divider-pill">🔒 Chặng 6 – 10 · ${secTitle}</span>
                        <span class="rm-stage-divider-line"></span>
                    </div>`;
            }

            const completedNodes = sectionNodes.filter(n => n.status === 'completed' && n.type !== 'chest' && n.type !== 'boss');
            const remainingNodes = sectionNodes.filter(n => !(n.status === 'completed' && n.type !== 'chest' && n.type !== 'boss'));

            if (completedNodes.length > 0) {
                timelineHtml += `<div class="rm-done-grid">${completedNodes.map(n => renderMysteryCompletedCard(n, chapter.id || 0)).join('')}</div>`;
            }

            const nonSpecialLocked = !started && remainingNodes.length > 2
                && remainingNodes.slice(0, -1).every(n => n.status === 'locked' && n.type !== 'chest' && n.type !== 'boss');
            if (nonSpecialLocked) {
                timelineHtml += renderMysterySteppingStonesRow(remainingNodes.slice(0, -1));
                timelineHtml += renderMysteryLessonRow(remainingNodes[remainingNodes.length - 1], chapter.id || 0);
            } else {
                remainingNodes.forEach(node => {
                    timelineHtml += renderMysteryLessonRow(node, chapter.id || 0);
                });
            }
            timelineHtml += '</section>';
        }
        container.innerHTML = timelineHtml + '</div>';
        renderMysteryNextBar();
    }

    function renderMysterySteppingStonesRow(lockedNodes) {
        const stonesHtml = lockedNodes.map((n, idx) => {
            const fl = (typeof window.getRoadmapSlotFlavor === 'function')
                ? window.getRoadmapSlotFlavor(n.num)
                : { icon: '✦', diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Tự chọn' };
            const conn = idx < lockedNodes.length - 1 ? '<span class="rm-stone-connector" aria-hidden="true"></span>' : '';
            return `<button type="button" class="rm-stone-node" onclick="if(typeof showDictToast==='function') showDictToast('🔒 Hoàn thành Chặng ${n.num - 1} để mở khóa Chặng ${n.num} (${fl.themeTag})!');" title="Chặng ${n.num} · ${fl.themeTag} (${fl.diffShort})"><span class="rm-stone-step">🔒 ${n.num}</span><span class="rm-stone-icon">${fl.icon}</span><span class="rm-stone-tag">${fl.themeTag}</span></button>${conn}`;
        }).join('');
        return `<div class="mb-row mb-state-locked"><div class="mb-card mb-card-stepping-stones"><div class="rm-stones-track">${stonesHtml}</div></div></div>`;
    }

    function renderMysteryLessonRow(node, chapterId) {
        const state = node.status, type = node.type || 'star', num = node.num;
        const isActive = state === 'active', isSpecial = (type === 'chest' || type === 'boss');
        const assigned = getAssignedStory(chapterId, num), story = assigned ? assigned.story : null;
        const isDeck = isRoadmapSlotInDeckMode(chapterId, num);
        const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
            ? window.resolveRoadmapDifficulty(node, story)
            : ((window.DIFFICULTY_META && story && window.DIFFICULTY_META[story.difficulty]) || { short: 'Vừa', badgeCls: 'age-badge-15' });

        if (state === 'completed') return `<div class="rm-single-done-wrap">${renderMysteryCompletedCard(node, chapterId)}</div>`;

        if (state === 'active' && !isSpecial) {
            if (isDeck || !story) {
                return `<div class="mb-row mb-state-active mb-state-mystery" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                    <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" role="button" tabindex="0">
                        <div class="mystery-shimmer-sweep"></div>
                        <div class="mb-card-body relative z-10">
                            <div class="flex items-center gap-1.5"><span class="rm-active-step-pill">CHẶNG ${num} · ĐANG HỌC</span></div>
                            <h4 class="mb-card-title mb-hero-title">Rút câu chuyện của bạn</h4>
                            <div class="rm-hero-cta-row"><span class="mb-card-cta rm-deck-draw-btn">+ Chọn truyện ngay</span></div>
                        </div>
                        <div class="mb-thumb mb-thumb-mystery-fan relative z-10" aria-hidden="true">
                            <div class="mystery-fan-card fan-left"><span>🦊</span></div><div class="mystery-fan-card fan-right"><span>✈️</span></div><div class="mystery-fan-card fan-center"><span>✦</span></div>
                        </div>
                    </div>
                </div>`;
            }
            const flipCls = (window.__justRevealedSlot === `${chapterId}_${num}`) ? 'is-flip-reveal' : '';
            const shortDur = String(story.duration || '5p').replace(/\s*phút/i, 'p');
            return `<div class="mb-row mb-state-active" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                <div class="mb-card mb-card-active-hero ${flipCls}" onclick="launchRevealedLesson(${num}, ${chapterId})" role="button" tabindex="0">
                    <div class="mb-thumb mb-thumb-hero-book">
                        <div class="hero-book-cover"><img src="${story.img}" alt="${story.title}" loading="lazy" /><span class="hero-book-spine"></span></div>
                        <span class="hero-book-pages"></span>
                    </div>
                    <div class="mb-card-body">
                        <div class="flex items-center justify-between gap-1.5">
                            <div class="flex items-center gap-1.5"><span class="rm-active-step-pill">CHẶNG ${num}</span><span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span><span class="mb-card-kicker text-[10.5px]">${shortDur}</span></div>
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="event.stopPropagation(); resetRoadmapSlotToDeck(${num}, ${chapterId})" class="rm-icon-chip is-deck" title="Úp lại bộ bài" aria-label="Úp bài">🃏</button>
                                <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" class="rm-swap-pill-btn" title="Đổi câu chuyện khác">🎲 Đổi</button>
                            </div>
                        </div>
                        <h4 class="mb-card-title mb-hero-title">${story.title}</h4>
                        <div class="rm-hero-cta-row"><span class="mb-card-cta rm-hero-play-btn">${ICON_PLAY} Học ngay</span><span class="rm-hero-xp-hint">+20% ⚡</span></div>
                    </div>
                </div>
            </div>`;
        }

        if (isSpecial) {
            const isBoss = type === 'boss';
            const badgeText = isBoss ? '👑 CHẶNG 10 · +300 XP' : `🎁 CHẶNG ${num} · +150 XP`;
            const milestoneTitle = isBoss ? 'Thử Thách Trùm Cuối' : 'Rương Kho Báu';
            const chestImg = isBoss ? 'assets/cards/lumi_progress_celebration.jpg' : 'assets/cards/reward_gift_box.jpg';
            const clickAct = (isActive && !isBoss) ? `claimRoadmapBonusChest(${chapterId})` : `openRoadmapMilestonePreview('${type}', ${num}, ${chapterId})`;
            return `<div class="mb-row mb-type-${type} mb-state-${state}">
                <div class="mb-card mb-card-milestone ${isBoss ? 'is-boss' : 'is-chest'}" onclick="${clickAct}">
                    <div class="mb-thumb mb-thumb-milestone"><img src="${chestImg}" alt="" loading="lazy" /><span class="rm-milestone-emblem">${isBoss ? '👑' : '🎁'}</span><span class="rm-milestone-lock-pill">${isActive ? '✨' : '🔒'}</span></div>
                    <div class="mb-card-body"><div class="flex items-center gap-1.5"><span class="rm-milestone-badge">${badgeText}</span></div><h4 class="mb-card-title">${milestoneTitle}</h4></div>
                    <span class="rm-milestone-arrow" aria-hidden="true">›</span>
                </div>
            </div>`;
        }

        const fl = (typeof window.getRoadmapSlotFlavor === 'function')
            ? window.getRoadmapSlotFlavor(num)
            : { icon: '☕', cards: ['☕', '🌧️', '🌿'], diffShort: 'Dễ', badgeCls: 'age-badge-3', themeTag: 'Đời thường' };
        return `<div class="mb-row mb-state-locked">
            <div class="mb-card mb-card-locked-slot" onclick="if(typeof showDictToast==='function') showDictToast('🔒 Hoàn thành Chặng ${num - 1} để mở khóa Chặng ${num} (${fl.themeTag})!');">
                <div class="rm-slot-inline-row"><span class="rm-slot-step-pill">🔒 Chặng ${num}</span><span class="age-badge ${fl.badgeCls}">${fl.diffShort}</span><span class="rm-slot-inline-label">Chủ đề: ${fl.themeTag}</span></div>
                <div class="rm-slot-genre-stack" aria-hidden="true"><span class="rm-genre-mini-card c1">${fl.cards[0]}</span><span class="rm-genre-mini-card c2">${fl.cards[1]}</span><span class="rm-genre-mini-card c3">${fl.cards[2]}</span></div>
            </div>
        </div>`;
    }

    function renderMysteryNextBar() {
        const bar = document.getElementById('mysteryRoadmapNextBar');
        if (bar) bar.classList.remove('is-visible');
    }

    function openRoadmapGenrePickerSheet(nodeNum = 3, chapterId = 0, source = 'classic') {
        currentPickingSlot = { chapterId, nodeNum, source };
        const sheet = ensureSheetMountedOnBody();
        if (!sheet) return;
        const badge = document.getElementById('pickerSheetNodeBadge');
        if (badge) badge.textContent = `CHẶNG ${nodeNum}`;
        if (typeof window.renderMysteryGenreCardsList === 'function') window.renderMysteryGenreCardsList();
        sheet.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeRoadmapGenrePickerSheet() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet) sheet.classList.add('hidden');
    }

    function bindStoryToCurrentSlot(matchedStory) {
        if (!matchedStory) return;
        closeRoadmapGenrePickerSheet();
        const { chapterId, nodeNum } = currentPickingSlot, key = getSlotKey(chapterId, nodeNum);
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[key] = false;
        mysteryState.revealedStories[key] = { story: matchedStory };
        mysteryState.revealedStories[nodeNum] = { story: matchedStory };
        window.__justRevealedSlot = key;
        setTimeout(() => { if (window.__justRevealedSlot === key) window.__justRevealedSlot = null; }, 1100);
        saveState();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
        if (typeof window.selectRoadmapChapter === 'function') window.selectRoadmapChapter(chapterId, { keepScroll: true });
        else renderMysteryRoadmapTimeline(chapterId);
        if (typeof showDictToast === 'function') showDictToast(`✨ Đã rút truyện "${matchedStory.title}" cho Chặng ${nodeNum}!`);
    }

    function handlePickStoryById(storyId) {
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        bindStoryToCurrentSlot(pool.find(s => String(s.id) === String(storyId)) || pool[0]);
    }

    function handleRandomStoryPick() {
        const list = (typeof window.getFilteredStories === 'function' && window.getFilteredStories().length > 0)
            ? window.getFilteredStories() : ((typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : []);
        bindStoryToCurrentSlot(list[Math.floor(Math.random() * list.length)]);
    }

    function launchRevealedLesson(nodeNum = 3, chapterId = 0) {
        const assigned = getAssignedStory(chapterId, nodeNum);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[chapterId || 0]) || { nodes: [] };
        const fallbackNode = (chapter.nodes || []).find(n => n.num === nodeNum);
        const story = (assigned && assigned.story) ? assigned.story : fallbackNode;
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
        renderMysteryRoadmapTimeline, openMysteryRoadmap, closeMysteryRoadmap, switchToClassicRoadmap,
        openRoadmapGenrePickerSheet, closeRoadmapGenrePickerSheet,
        handlePickStoryById, handleRandomStoryPick, handleSelectGenreAndReveal: handleRandomStoryPick, launchRevealedLesson
    });
})(window);
