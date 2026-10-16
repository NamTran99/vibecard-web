// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP CONTROLLER (DYNAMIC STORY SLOTS)
// Style: Kế thừa 100% Timeline, Sections & Linh vật chuẩn M3-07 (Light & Dark)
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    const ICON_SPARKLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10z"/></svg>';
    const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>';
    const ICON_PLAY = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.34-5.89a1.5 1.5 0 000-2.54L6.3 2.84z"/></svg>';

    const STORAGE_KEY = 'vibecard_custom_roadmap_slots_v4';
    let mysteryState = { activeNodeNum: 3, revealedStories: {} };
    let mysteryListenersBound = false;
    let currentPickingSlot = { chapterId: 0, nodeNum: 3, source: 'classic' };

    function getSlotKey(chapterId, nodeNum) { return `${chapterId || 0}_${nodeNum}`; }

    function getAssignedStory(chapterId, nodeNum) {
        return mysteryState.revealedStories[getSlotKey(chapterId, nodeNum)] || mysteryState.revealedStories[nodeNum] || null;
    }

    function loadSavedState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (parsed && typeof parsed === 'object') mysteryState = Object.assign(mysteryState, parsed);
        } catch (e) {}
    }

    function saveState() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mysteryState)); } catch (e) {}
    }

    loadSavedState();

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
            if (topBar) {
                if (y > 56) topBar.classList.add('is-scrolled');
                else if (y < 8) topBar.classList.remove('is-scrolled');
            }
            const nextBar = document.getElementById('mysteryRoadmapNextBar');
            const dy = y - lastY;
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
        renderMysteryRoadmapTimeline();
        screen.classList.remove('hidden');
        requestAnimationFrame(() => screen.classList.remove('translate-x-full'));
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (topBar) topBar.classList.remove('is-scrolled');
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
        closeMysteryRoadmap();
        setTimeout(() => { if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(0); }, 220);
    }

    function renderMysteryAmbientRain() {
        const container = document.getElementById('mysteryAmbientContainer');
        if (!container) return;
        let html = '';
        for (let i = 0; i < 16; i++) {
            html += `<div class="ambient-rain-drop" style="left:${(Math.random() * 100).toFixed(1)}%; top:${(Math.random() * -80).toFixed(0)}px; animation-duration:${(0.85 + Math.random() * 0.65).toFixed(2)}s; animation-delay:${(Math.random() * 2).toFixed(2)}s;"></div>`;
        }
        container.innerHTML = html;
    }

    function renderMysteryRoadmapTimeline() {
        const container = document.getElementById('mysteryRoadmapNodesContainer');
        if (!container) return;
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[0]) ? window.roadmapChaptersData[0] : { id: 0, nodes: [] };
        const nodes = chapter.nodes || [];
        const cleanMascots = [
            { name: 'Thần Rừng Lumi', img: 'assets/create/lumi_fox.png', quote: 'Tô sáng từng vạch màu để đánh thức phép thuật rừng sâu!' },
            { name: 'Lumi Nhà Thám Hiểm', img: 'assets/library/lumi_reading_fox.webp', quote: 'Cố lên! Vòng 2 sẽ mở ra câu chuyện huyền ảo!' }
        ];
        const sectionTitles = ['Trú mưa dưới hiên', 'Bước ra màn đêm'];
        const perLoop = 5;
        const loops = Math.ceil(nodes.length / perLoop);
        let timelineHtml = '<div class="mb-timeline mb-animate-in">';

        for (let loop = 0; loop < loops; loop++) {
            const sectionNodes = nodes.slice(loop * perLoop, (loop + 1) * perLoop);
            const completedCount = sectionNodes.filter(n => n.status === 'completed').length;
            const started = completedCount > 0 || sectionNodes.some(n => n.status === 'active');
            const fillPct = Math.min(100, completedCount * 20);
            const mastered = fillPct >= 100;
            const char = cleanMascots[loop] || cleanMascots[0];
            const nodeIcon = mastered ? ICON_CHECK : (started ? ICON_SPARKLE : ICON_LOCK);
            const segments = Array.from({ length: perLoop }, (_, i) => `<span class="${i < completedCount ? 'on' : ''}"></span>`).join('');

            timelineHtml += `
                <section class="mb-section" data-loop="${loop + 1}">
                    <div class="mb-row mb-head-row mb-down ${started ? 'mb-down-on' : ''}">
                        <div class="mb-rail"><span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span></div>
                        <div class="mb-head">
                            <div class="mb-head-text">
                                <span class="mb-head-eyebrow">Vòng ${loop + 1}</span>
                                <h3 class="mb-head-title">${sectionTitles[loop] || `Vòng ${loop + 1}`}</h3>
                                <div class="mb-segbar-row">
                                    <div class="mb-segbar ${mastered ? 'is-mastered' : ''}">${segments}</div>
                                    <span class="mb-segbar-count">${completedCount}/5</span>
                                </div>
                            </div>
                            <div class="mb-char ${mastered ? 'is-mastered' : ''} ${started ? '' : 'is-waiting'}"
                                 onclick="if(typeof handleCharacterTap==='function') handleCharacterTap(this);">
                                <div class="mb-char-bubble">${char.quote}</div>
                                <div class="mb-char-shadow"></div>
                                <img class="mb-char-gray" src="${char.img}" alt="" />
                                <img class="mb-char-color" src="${char.img}" alt="" style="clip-path: inset(${100 - fillPct}% 0 0 0);" />
                            </div>
                        </div>
                    </div>`;
            sectionNodes.forEach((node, i) => {
                timelineHtml += renderMysteryLessonRow(node, chapter.id || 0, i === sectionNodes.length - 1);
            });
            timelineHtml += '</section>';
        }
        container.innerHTML = timelineHtml + '</div>';
        renderMysteryNextBar(chapter);
    }

    function renderMysteryLessonRow(node, chapterId, isLastInSection) {
        const state = node.status, type = node.type || 'star', num = node.num;
        const railCls = isLastInSection ? 'mb-up mb-up-on mb-down-long' : 'mb-up mb-up-on mb-down mb-down-on';
        const assigned = getAssignedStory(chapterId, num);
        const story = assigned ? assigned.story : null;
        const gMeta = (window.GENRE_META && story && window.GENRE_META[story.genre]) || { icon: '✨', name: 'Truyện' };
        const dMeta = (window.DIFFICULTY_META && story && window.DIFFICULTY_META[story.difficulty]) || { badgeCls: 'age-badge-15' };

        if (state === 'completed') {
            const title = story ? story.title : node.title;
            const img = story ? story.img : node.img;
            const badge = story ? story.age : ((node.display_badges && node.display_badges[0]) || '15+');
            return `
                <div class="mb-row ${railCls} mb-state-completed mb-type-${type}">
                    <div class="mb-rail"><span class="mb-dot">${ICON_CHECK}</span></div>
                    <div class="mb-card" onclick="launchRevealedLesson(${num}, ${chapterId})" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${badge}</span><span class="mb-card-kicker">${story ? story.duration : '5 phút'}</span></div>
                            <h4 class="mb-card-title">${title}</h4>
                        </div>
                        <div class="mb-thumb"><img src="${img}" alt="${title}" loading="lazy" /></div>
                    </div>
                </div>`;
        }

        if (state === 'active') {
            if (!story) {
                return `
                    <div class="mb-row ${railCls} mb-state-active mb-state-mystery" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                        <div class="mb-rail"><span class="mb-dot mb-dot-mystery">+</span></div>
                        <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" role="button" tabindex="0">
                            <div class="mystery-shimmer-sweep"></div>
                            <div class="mb-card-body relative z-10">
                                <div class="flex items-center gap-1.5"><span class="age-badge age-badge-15">🎲 TỰ CHỌN</span><span class="mb-card-kicker font-black" style="color: var(--rm-amber-text, #D97706);">Chặng ${num}</span></div>
                                <h4 class="mb-card-title font-extrabold text-[15px] leading-tight">Chọn câu chuyện</h4>
                                <span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">+ Chọn truyện ✨</span>
                            </div>
                            <div class="mb-thumb mb-thumb-mystery relative z-10"><span class="mystery-qmark-icon">+</span></div>
                        </div>
                    </div>`;
            }
            return `
                <div class="mb-row ${railCls} mb-state-active" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                    <div class="mb-rail"><span class="mb-dot"><span class="mb-active-lumi-companion">🦊</span></span></div>
                    <div class="mb-card" onclick="launchRevealedLesson(${num}, ${chapterId})" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center justify-between gap-1">
                                <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${story.age}</span><span class="mb-card-kicker text-[10.5px]">${gMeta.icon} ${gMeta.name}</span></div>
                                <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" class="text-[10.5px] font-bold hover:underline" style="color: var(--rm-amber-text, #D97706);">Đổi ↺</button>
                            </div>
                            <h4 class="mb-card-title font-extrabold">${story.title}</h4>
                            <span class="mb-card-cta">Học ngay ${ICON_PLAY}</span>
                        </div>
                        <div class="mb-thumb"><img src="${story.img}" alt="${story.title}" loading="lazy" /></div>
                    </div>
                </div>`;
        }

        const isSpecial = type === 'chest' || type === 'boss';
        const kickerLabel = type === 'chest' ? '🎁 +150 XP' : (type === 'boss' ? '👑 8 phút' : `Chặng ${num}`);
        const extraCls = type === 'chest' ? 'mb-type-chest' : (type === 'boss' ? 'mb-type-boss mt-4' : '');
        const thumbHtml = isSpecial
            ? `<div class="mb-thumb"><img src="${node.img}" alt="" /><div class="mb-thumb-badge">🔒</div>${type === 'boss' ? '<span class="mb-crown">👑</span>' : ''}</div>`
            : `<div class="mb-thumb mb-thumb-slot-locked"><span class="slot-locked-icon">🔒</span></div>`;
        return `
            <div class="mb-row ${railCls} ${extraCls} mb-state-locked">
                <div class="mb-rail"><span class="mb-dot"></span></div>
                <div class="mb-card" aria-disabled="true">
                    <div class="mb-card-body"><span class="mb-card-kicker">${kickerLabel}</span><h4 class="mb-card-title">${isSpecial ? node.title : 'Chặng tự chọn'}</h4></div>
                    ${thumbHtml}
                </div>
            </div>`;
    }

    function renderMysteryNextBar(chapter) {
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        let bar = document.getElementById('mysteryRoadmapNextBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'mysteryRoadmapNextBar';
            bar.className = 'mb-nextbar is-visible';
            screen.appendChild(bar);
        }
        const activeNode = (chapter.nodes || []).find(n => n.status === 'active') || { num: 3 };
        const assigned = getAssignedStory(chapter.id || 0, activeNode.num);
        const story = assigned ? assigned.story : null;
        bar.innerHTML = `
            <div class="mb-nextbar-inner" onclick="${story ? `launchRevealedLesson(${activeNode.num}, ${chapter.id || 0})` : `openRoadmapGenrePickerSheet(${activeNode.num}, ${chapter.id || 0}, 'mystery')`}">
                <button type="button" class="mb-nextbar-lumi-btn" title="Trợ lý Lumi"><span class="mb-nextbar-lumi-avatar">🦊</span><span class="mb-nextbar-lumi-badge">✨</span></button>
                <div class="mb-nextbar-text">
                    <span class="mb-nextbar-kicker">Chặng ${activeNode.num} · ${story ? 'Tiếp tục' : 'Tự chọn'}</span>
                    <span class="mb-nextbar-title">${story ? story.title : '+ Chọn truyện học ngay'}</span>
                </div>
                <button type="button" class="mb-nextbar-go" aria-label="Tiếp tục">${story ? ICON_PLAY : '+'}</button>
            </div>`;
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
        const { chapterId, nodeNum } = currentPickingSlot;
        mysteryState.revealedStories[getSlotKey(chapterId, nodeNum)] = { story: matchedStory };
        mysteryState.revealedStories[nodeNum] = { story: matchedStory };
        saveState();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
        if (typeof window.selectRoadmapChapter === 'function') window.selectRoadmapChapter(chapterId, { keepScroll: true });
        renderMysteryRoadmapTimeline();
        if (typeof showDictToast === 'function') showDictToast(`✨ Đã gắn "${matchedStory.title}" vào Chặng ${nodeNum}!`);
        setTimeout(() => launchRevealedLesson(nodeNum, chapterId), 320);
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
        if (!assigned || !assigned.story) { openRoadmapGenrePickerSheet(nodeNum, chapterId, 'classic'); return; }
        const story = assigned.story;
        const lessonPayload = {
            chapterNumber: nodeNum, title: story.title, subtitle: story.subtitle || `Chặng ${nodeNum}`,
            category: `CHẶNG ${nodeNum} • ${story.age || 'TỰ CHỌN'}`, desc: story.scenario,
            image: story.img, thumbnail: story.img, duration: story.duration || '5 phút',
            progressPill: `Chặng ${nodeNum}/10`, progressPercent: nodeNum * 10
        };
        if (typeof window.openStoryReaderScreen === 'function') { window.openStoryReaderScreen(lessonPayload); return; }
        if (typeof window.openLessonIntroScreen === 'function') window.openLessonIntroScreen(chapterId, lessonPayload);
    }

    window.getAssignedRoadmapStory = getAssignedStory;
    window.openMysteryRoadmap = openMysteryRoadmap;
    window.closeMysteryRoadmap = closeMysteryRoadmap;
    window.switchToClassicRoadmap = switchToClassicRoadmap;
    window.openRoadmapGenrePickerSheet = openRoadmapGenrePickerSheet;
    window.closeRoadmapGenrePickerSheet = closeRoadmapGenrePickerSheet;
    window.handlePickStoryById = handlePickStoryById;
    window.handleRandomStoryPick = handleRandomStoryPick;
    window.handleSelectGenreAndReveal = handleRandomStoryPick;
    window.launchRevealedLesson = launchRevealedLesson;
})(window);
