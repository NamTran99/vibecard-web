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
            const heroBox = document.getElementById('mysteryHeroContentBox');
            if (heroBox) {
                const fade = Math.max(0, Math.min(1, 1 - Math.max(0, y - 36) / 100));
                heroBox.style.opacity = String(fade);
                heroBox.style.transform = `translateY(${Math.min(14, Math.max(0, (y - 36) * 0.14)).toFixed(1)}px)`;
            }
            if (topBar) {
                if (y > 140) topBar.classList.add('is-scrolled');
                else if (y < 115) topBar.classList.remove('is-scrolled');
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
        const heroBox = document.getElementById('mysteryHeroContentBox');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (topBar) topBar.classList.remove('is-scrolled');
        if (heroBox) { heroBox.style.opacity = '1'; heroBox.style.transform = 'translateY(0)'; }
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
            { name: 'Thần Rừng Lumi', img: 'assets/create/lumi_fox.png', quote: 'Mỗi chặng hoàn thành giúp mình thức tỉnh thêm 20% sắc màu phép thuật!' },
            { name: 'Lumi Nhà Thám Hiểm', img: 'assets/library/lumi_reading_fox.webp', quote: 'Cố lên! Vòng 2 sẽ mở ra kho báu và thử thách trùm cuối!' }
        ];
        const sectionTitles = ['Trú mưa dưới hiên', 'Bước ra màn đêm'];
        const perLoop = 5, loops = Math.ceil(nodes.length / perLoop);
        let timelineHtml = '<div class="mb-timeline mb-animate-in">';

        for (let loop = 0; loop < loops; loop++) {
            const sectionNodes = nodes.slice(loop * perLoop, (loop + 1) * perLoop);
            const completedCount = sectionNodes.filter(n => n.status === 'completed').length;
            const started = completedCount > 0 || sectionNodes.some(n => n.status === 'active');
            const fillPct = Math.min(100, completedCount * 20), mastered = fillPct >= 100;
            const showWave = fillPct > 0 && fillPct < 100;
            const char = cleanMascots[loop] || cleanMascots[0];
            const nodeIcon = mastered ? ICON_CHECK : (started ? ICON_SPARKLE : ICON_LOCK);
            const segments = Array.from({ length: perLoop }, (_, i) => `<span class="${i < completedCount ? 'on' : ''}"></span>`).join('');
            const headPaws = (typeof window.renderRailPawsHtml === 'function') ? window.renderRailPawsHtml(true, started, false, false) : '';
            const pctLabel = mastered ? '✨ 100% Thức tỉnh' : (started ? `⚡ ${fillPct}% Đánh thức` : '🔒 0% Đánh thức');

            timelineHtml += `
                <section class="mb-section" data-loop="${loop + 1}">
                    <div class="mb-row mb-head-row mb-down ${started ? 'mb-down-on' : ''}">
                        <div class="mb-rail"><span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span>${headPaws}</div>
                        <div class="mb-head">
                            <div class="mb-head-text">
                                <span class="mb-head-eyebrow">Vòng ${loop + 1} · ${char.name}</span>
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
                                <div class="mb-char-line" style="bottom: calc(${fillPct}% - 1px); opacity: ${showWave ? 1 : 0};"></div>
                                <span class="mb-char-pct-pill ${mastered ? 'is-mastered' : ''}">${pctLabel}</span>
                            </div>
                        </div>
                    </div>`;
            sectionNodes.forEach((node, i) => {
                const isLastInSection = i === sectionNodes.length - 1;
                const isVeryLast = (loop === loops - 1) && isLastInSection;
                timelineHtml += renderMysteryLessonRow(node, chapter.id || 0, isLastInSection, isVeryLast);
            });
            timelineHtml += '</section>';
        }
        container.innerHTML = timelineHtml + '</div>';
        renderMysteryNextBar(chapter);
    }

    function renderMysteryLessonRow(node, chapterId, isLastInSection, isVeryLast) {
        const state = node.status, type = node.type || 'star', num = node.num;
        const downOn = state === 'completed', isActive = state === 'active';
        const railCls = ['mb-up', (downOn || isActive) ? 'mb-up-on' : '', !isVeryLast ? 'mb-down' : '', downOn ? 'mb-down-on' : '', (isLastInSection && !isVeryLast) ? 'mb-down-long' : ''].filter(Boolean).join(' ');
        const pawsHtml = (typeof window.renderRailPawsHtml === 'function') ? window.renderRailPawsHtml(!isVeryLast, downOn, isActive, isLastInSection && !isVeryLast) : '';
        const assigned = getAssignedStory(chapterId, num);
        const story = assigned ? assigned.story : null;
        const gMeta = (window.GENRE_META && story && window.GENRE_META[story.genre]) || { name: 'Truyện' };
        const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
            ? window.resolveRoadmapDifficulty(node, story)
            : ((window.DIFFICULTY_META && story && window.DIFFICULTY_META[story.difficulty]) || { short: 'Độ khó: Vừa', badgeCls: 'age-badge-15' });

        if (state === 'completed') {
            const title = story ? story.title : node.title, img = story ? story.img : node.img;
            return `
                <div class="mb-row ${railCls} mb-state-completed mb-type-${type}">
                    <div class="mb-rail"><span class="mb-dot">${ICON_CHECK}</span>${pawsHtml}</div>
                    <div class="mb-card mb-card-completed-strip" onclick="launchRevealedLesson(${num}, ${chapterId})" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span><span class="rm-done-pill">✓ Đã học · ${story ? story.duration : '5 phút'}</span></div>
                            <h4 class="mb-card-title">${title}</h4>
                        </div>
                        <div class="mb-thumb mb-thumb-compact"><img src="${img}" alt="${title}" loading="lazy" /></div>
                    </div>
                </div>`;
        }

        if (state === 'active') {
            if (!story) {
                return `
                    <div class="mb-row ${railCls} mb-state-active mb-state-mystery" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                        <div class="mb-rail"><span class="mb-dot mb-dot-lumi-token"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-dot-lumi-avatar" /></span>${pawsHtml}</div>
                        <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" role="button" tabindex="0">
                            <div class="mystery-shimmer-sweep"></div>
                            <div class="mb-card-body relative z-10">
                                <div class="flex items-center gap-1.5"><span class="rm-active-step-pill">CHẶNG ${num} · ĐANG MỞ</span><span class="age-badge age-badge-15">TỰ CHỌN</span></div>
                                <h4 class="mb-card-title mb-hero-title">Rút câu chuyện của bạn</h4>
                                <div class="rm-hero-cta-row"><span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">🃏 Chọn câu chuyện</span><span class="rm-hero-xp-hint">+20% Lumi</span></div>
                            </div>
                            <div class="mb-thumb mb-thumb-mystery-fan relative z-10" aria-hidden="true">
                                <div class="mystery-fan-card fan-left"></div><div class="mystery-fan-card fan-right"></div><div class="mystery-fan-card fan-center"><span>✦</span></div>
                            </div>
                        </div>
                    </div>`;
            }
            return `
                <div class="mb-row ${railCls} mb-state-active" id="mysteryNodeRow-${chapterId}-${num}" data-roadmap-active="1">
                    <div class="mb-rail"><span class="mb-dot mb-dot-lumi-token"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-dot-lumi-avatar" /></span>${pawsHtml}</div>
                    <div class="mb-card mb-card-active-hero" onclick="launchRevealedLesson(${num}, ${chapterId})" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center justify-between gap-1">
                                <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span><span class="mb-card-kicker text-[10.5px]">${gMeta.name} · ${story.duration}</span></div>
                                <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num}, ${chapterId}, 'mystery')" class="rm-swap-story-chip" title="Đổi câu chuyện khác">🎲 Đổi truyện</button>
                            </div>
                            <h4 class="mb-card-title mb-hero-title">${story.title}</h4>
                            <div class="rm-hero-cta-row"><span class="mb-card-cta rm-hero-play-btn">${ICON_PLAY} Học ngay</span><span class="rm-hero-xp-hint">⚡ +20% Lumi</span></div>
                        </div>
                        <div class="mb-thumb mb-thumb-hero-book">
                            <div class="hero-book-cover"><img src="${story.img}" alt="${story.title}" loading="lazy" /><span class="hero-book-spine"></span></div>
                            <span class="hero-book-pages"></span>
                        </div>
                    </div>
                </div>`;
        }

        if (type === 'chest' || type === 'boss') {
            const isBoss = type === 'boss';
            const badgeText = isBoss ? '👑 TRÙM CUỐI · +300 XP' : '🎁 RƯƠNG BÁU · +150 XP';
            const subHint = isBoss ? 'Hoàn thành Chặng 9 để khiêu chiến' : 'Mở khóa khi hoàn thành Chặng 4';
            return `
                <div class="mb-row ${railCls} mb-type-${type} mb-state-locked">
                    <div class="mb-rail"><span class="mb-dot"></span>${pawsHtml}</div>
                    <div class="mb-card mb-card-milestone ${isBoss ? 'is-boss' : 'is-chest'}" aria-disabled="true">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5"><span class="rm-milestone-badge">${badgeText}</span></div>
                            <h4 class="mb-card-title">${node.title}</h4><span class="rm-milestone-sub">${subHint}</span>
                        </div>
                        <div class="mb-thumb mb-thumb-milestone"><img src="${node.img}" alt="" loading="lazy" /><span class="rm-milestone-lock-pill">🔒</span></div>
                    </div>
                </div>`;
        }

        return `
            <div class="mb-row ${railCls} mb-state-locked">
                <div class="mb-rail"><span class="mb-dot"></span>${pawsHtml}</div>
                <div class="mb-card mb-card-locked-slot" aria-disabled="true">
                    <div class="mb-card-body">
                        <div class="flex items-center gap-1.5"><span class="rm-slot-step-badge">Chặng ${num}</span><span class="rm-slot-unlock-hint">Mở sau Chặng ${num - 1}</span></div>
                        <h4 class="mb-card-title rm-slot-title">Ô truyện tự chọn</h4>
                    </div>
                    <div class="rm-slot-genre-stack" aria-hidden="true">
                        <span class="rm-genre-mini-card c1">📖</span><span class="rm-genre-mini-card c2">✈️</span><span class="rm-genre-mini-card c3">🔒</span>
                    </div>
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
                <button type="button" class="mb-nextbar-lumi-btn" title="Trợ lý Lumi"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-nextbar-lumi-img" /><span class="mb-nextbar-lumi-badge">✨</span></button>
                <div class="mb-nextbar-text">
                    <span class="mb-nextbar-kicker">Chặng ${activeNode.num} · ${story ? 'Đang học' : 'Tự chọn'}</span>
                    <span class="mb-nextbar-title">${story ? story.title : '🃏 Chọn câu chuyện học ngay'}</span>
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
