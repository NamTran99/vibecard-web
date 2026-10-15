// ========================================================
// 🗺️ MYSTERY ROADMAP CONTROLLER (ADAPTIVE RPG & GENRE MATCHMAKING)
// Style: Kế thừa 100% Timeline, Sections & Linh vật chuẩn M3-07 (Light & Dark)
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    const ICON_SPARKLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10z"/></svg>';
    const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>';
    const ICON_PLAY = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.34-5.89a1.5 1.5 0 000-2.54L6.3 2.84z"/></svg>';

    const STORAGE_KEY = 'vibecard_mystery_roadmap_v3_state';
    let mysteryState = { activeNodeNum: 3, revealedStories: {} };
    let mysteryListenersBound = false;
    let currentPickingNodeNum = 3;

    function getGenreCatalog() {
        return window.MYSTERY_GENRE_CATALOG || {};
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
        setTimeout(() => {
            if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(0);
        }, 220);
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

        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[0])
            ? window.roadmapChaptersData[0]
            : { nodes: [] };

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
            const start = loop * perLoop;
            const sectionNodes = nodes.slice(start, start + perLoop);
            const completedCount = sectionNodes.filter(n => n.status === 'completed').length;
            const hasActive = sectionNodes.some(n => n.status === 'active');
            const fillPct = Math.min(100, completedCount * 20);
            const mastered = fillPct >= 100;
            const started = completedCount > 0 || hasActive;
            const char = cleanMascots[loop] || cleanMascots[0];
            const sectionTitle = sectionTitles[loop] || `Vòng ${loop + 1}`;
            const nodeIcon = mastered ? ICON_CHECK : (started ? ICON_SPARKLE : ICON_LOCK);
            const segments = Array.from({ length: perLoop }, (_, i) => `<span class="${i < completedCount ? 'on' : ''}"></span>`).join('');

            timelineHtml += `
                <section class="mb-section" data-loop="${loop + 1}">
                    <div class="mb-row mb-head-row mb-down ${started ? 'mb-down-on' : ''}">
                        <div class="mb-rail">
                            <span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span>
                        </div>
                        <div class="mb-head">
                            <div class="mb-head-text">
                                <span class="mb-head-eyebrow">Vòng ${loop + 1}</span>
                                <h3 class="mb-head-title">${sectionTitle}</h3>
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
                    </div>
            `;

            sectionNodes.forEach((node, i) => {
                timelineHtml += renderMysteryLessonRow(node, loop, i === sectionNodes.length - 1);
            });
            timelineHtml += '</section>';
        }

        timelineHtml += '</div>';
        container.innerHTML = timelineHtml;
        renderMysteryNextBar(chapter);
    }

    function renderMysteryLessonRow(node, loopIdx, isLastInSection) {
        const state = node.status;
        const type = node.type || 'star';
        const num = node.num;
        const railCls = isLastInSection ? 'mb-up mb-up-on mb-down-long' : 'mb-up mb-up-on mb-down mb-down-on';
        const revealedData = mysteryState.revealedStories[num];
        const isRevealed = !!revealedData;
        const catalog = getGenreCatalog();

        if (state === 'completed') {
            const ageBadge = (node.display_badges && node.display_badges[0]) || node.ageRating || '15+';
            const ageCls = ageBadge.includes('18') ? 'age-badge-18' : (ageBadge.includes('3') ? 'age-badge-3' : 'age-badge-15');
            return `
                <div class="mb-row ${railCls} mb-state-completed mb-type-${type}">
                    <div class="mb-rail"><span class="mb-dot">${ICON_CHECK}</span></div>
                    <div class="mb-card" onclick="openStoryReaderScreen()" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5">
                                <span class="age-badge ${ageCls}">${ageBadge}</span>
                                <span class="mb-card-kicker">5 phút</span>
                            </div>
                            <h4 class="mb-card-title">${node.title}</h4>
                        </div>
                        <div class="mb-thumb"><img src="${node.img}" alt="${node.title}" loading="lazy" /></div>
                    </div>
                </div>`;
        }

        if (state === 'active') {
            if (!isRevealed) {
                return `
                    <div class="mb-row ${railCls} mb-state-active mb-state-mystery" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                        <div class="mb-rail"><span class="mb-dot mb-dot-mystery">?</span></div>
                        <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num})" role="button" tabindex="0">
                            <div class="mystery-shimmer-sweep"></div>
                            <div class="mb-card-body relative z-10">
                                <div class="flex items-center gap-1.5">
                                    <span class="age-badge age-badge-15">🎲 BÍ ẨN</span>
                                    <span class="mb-card-kicker font-black" style="color: var(--rm-amber-text, #D97706);">5 phút</span>
                                </div>
                                <h4 class="mb-card-title font-extrabold text-[15px] leading-tight">Chặng ${num}</h4>
                                <span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">Lật mở ✨</span>
                            </div>
                            <div class="mb-thumb mb-thumb-mystery relative z-10"><span class="mystery-qmark-icon">?</span></div>
                        </div>
                    </div>`;
            }
            const { genreKey, story } = revealedData;
            const genre = catalog[genreKey] || catalog.travel_daily;
            return `
                <div class="mb-row ${railCls} mb-state-active" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                    <div class="mb-rail"><span class="mb-dot"><span class="mb-active-lumi-companion">🦊</span></span></div>
                    <div class="mb-card" onclick="launchRevealedLesson(${num})" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center justify-between gap-1">
                                <div class="flex items-center gap-1.5">
                                    <span class="age-badge ${genre.ageClass}">${story.age}</span>
                                    <span class="mb-card-kicker text-[10.5px]">${genre.icon} ${genre.name}</span>
                                </div>
                                <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num})" class="text-[10.5px] font-bold hover:underline" style="color: var(--rm-amber-text, #D97706);">Đổi ↺</button>
                            </div>
                            <h4 class="mb-card-title font-extrabold">${story.title}</h4>
                            <span class="mb-card-cta">Học ngay ${ICON_PLAY}</span>
                        </div>
                        <div class="mb-thumb"><img src="${story.img}" alt="${story.title}" loading="lazy" /></div>
                    </div>
                </div>`;
        }

        const kickerLabel = type === 'chest' ? '🎁 +150 XP' : (type === 'boss' ? '👑 8 phút' : `Chặng ${num}`);
        const extraCls = type === 'chest' ? 'mb-type-chest' : (type === 'boss' ? 'mb-type-boss mt-4' : '');
        const crown = type === 'boss' ? '<span class="mb-crown">👑</span>' : '';
        return `
            <div class="mb-row ${railCls} ${extraCls} mb-state-locked">
                <div class="mb-rail"><span class="mb-dot"></span></div>
                <div class="mb-card" aria-disabled="true">
                    <div class="mb-card-body">
                        <span class="mb-card-kicker">${kickerLabel}</span>
                        <h4 class="mb-card-title">${node.title}</h4>
                    </div>
                    <div class="mb-thumb">
                        <img src="${node.img}" alt="" />
                        <div class="mb-thumb-badge">🔒</div>${crown}
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
        const activeNode = (chapter.nodes || []).find(n => n.status === 'active') || { num: 3, title: 'Chặng Bí Ẩn' };
        const isRevealed = !!mysteryState.revealedStories[activeNode.num];
        const story = isRevealed ? mysteryState.revealedStories[activeNode.num].story : null;

        bar.innerHTML = `
            <div class="mb-nextbar-inner" onclick="${isRevealed ? `launchRevealedLesson(${activeNode.num})` : `openRoadmapGenrePickerSheet(${activeNode.num})`}">
                <button type="button" class="mb-nextbar-lumi-btn" title="Trợ lý Lumi">
                    <span class="mb-nextbar-lumi-avatar">🦊</span>
                    <span class="mb-nextbar-lumi-badge">✨</span>
                </button>
                <div class="mb-nextbar-text">
                    <span class="mb-nextbar-kicker">Chặng ${activeNode.num} · ${isRevealed ? 'Tiếp tục' : 'Bí ẩn'}</span>
                    <span class="mb-nextbar-title">${isRevealed ? story.title : 'Lật mở thẻ bài'}</span>
                </div>
                <button type="button" class="mb-nextbar-go" aria-label="Tiếp tục">${isRevealed ? ICON_PLAY : '✨'}</button>
            </div>`;
    }

    function openRoadmapGenrePickerSheet(nodeNum = 3) {
        currentPickingNodeNum = nodeNum;
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (!sheet) return;
        if (typeof window.renderMysteryGenreCardsList === 'function') window.renderMysteryGenreCardsList();
        sheet.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeRoadmapGenrePickerSheet() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet) sheet.classList.add('hidden');
    }

    function handleSelectGenreAndReveal(genreKey) {
        closeRoadmapGenrePickerSheet();
        const num = currentPickingNodeNum;
        const catalog = getGenreCatalog();
        const availableKeys = ['kids_fable', 'travel_daily', 'pro_business'];
        const chosenKey = genreKey === 'mystery_random' ? availableKeys[Math.floor(Math.random() * availableKeys.length)] : genreKey;
        const genreData = catalog[chosenKey] || catalog.travel_daily;
        const matchedStory = genreData.stories[Math.floor(Math.random() * genreData.stories.length)];

        mysteryState.revealedStories[num] = { genreKey: chosenKey, story: matchedStory };
        saveState();

        const row = document.getElementById(`mysteryNodeRow-${num}`);
        if (row) {
            row.classList.add('mb-card-flip-reveal');
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
            setTimeout(() => {
                renderMysteryRoadmapTimeline();
                if (typeof showDictToast === 'function') showDictToast(`✨ Đã mở khóa: "${matchedStory.title}" (${matchedStory.age})!`);
                setTimeout(() => launchRevealedLesson(num), 500);
            }, 350);
        } else {
            renderMysteryRoadmapTimeline();
            setTimeout(() => launchRevealedLesson(num), 400);
        }
    }

    function launchRevealedLesson(nodeNum = 3) {
        const revealed = mysteryState.revealedStories[nodeNum];
        if (!revealed) return;
        const story = revealed.story;
        const lessonPayload = {
            chapterNumber: nodeNum, title: story.title, subtitle: story.subtitle,
            category: `CHẶNG BÍ ẨN • ${story.age}`, desc: story.scenario,
            image: story.img, thumbnail: story.img, duration: story.duration,
            progressPill: `Chặng ${nodeNum}/10`, progressPercent: nodeNum * 10
        };
        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen(lessonPayload);
            return;
        }
        if (typeof window.openLessonIntroScreen === 'function') window.openLessonIntroScreen(0, lessonPayload);
    }

    window.openMysteryRoadmap = openMysteryRoadmap;
    window.closeMysteryRoadmap = closeMysteryRoadmap;
    window.switchToClassicRoadmap = switchToClassicRoadmap;
    window.openRoadmapGenrePickerSheet = openRoadmapGenrePickerSheet;
    window.closeRoadmapGenrePickerSheet = closeRoadmapGenrePickerSheet;
    window.handleSelectGenreAndReveal = handleSelectGenreAndReveal;
    window.launchRevealedLesson = launchRevealedLesson;
})(window);
