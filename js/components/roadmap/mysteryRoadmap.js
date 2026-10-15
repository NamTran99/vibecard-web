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
    let mysteryState = {
        activeNodeNum: 3,
        revealedStories: {}
    };
    let mysteryListenersBound = false;

    function getGenreCatalog() {
        return window.MYSTERY_GENRE_CATALOG || {};
    }

    function loadSavedState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    mysteryState = Object.assign(mysteryState, parsed);
                }
            }
        } catch (e) {}
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mysteryState));
        } catch (e) {}
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
        if (classicScreen && !classicScreen.classList.contains('hidden')) {
            classicScreen.classList.add('hidden');
        }

        bindMysteryScrollListener();
        renderMysteryAmbientRain();
        renderMysteryRoadmapTimeline();
        screen.classList.remove('hidden');

        requestAnimationFrame(() => {
            screen.classList.remove('translate-x-full');
        });

        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (topBar) topBar.classList.remove('is-scrolled');

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }
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
            if (typeof window.openParchmentRoadmap === 'function') {
                window.openParchmentRoadmap(0);
            }
        }, 220);
    }

    function renderMysteryAmbientRain() {
        const container = document.getElementById('mysteryAmbientContainer');
        if (!container) return;
        let html = '';
        for (let i = 0; i < 16; i++) {
            const left = (Math.random() * 100).toFixed(1);
            const top = (Math.random() * -80).toFixed(0);
            const dur = (0.85 + Math.random() * 0.65).toFixed(2);
            const del = (Math.random() * 2).toFixed(2);
            html += `<div class="ambient-rain-drop" style="left:${left}%; top:${top}px; animation-duration:${dur}s; animation-delay:${del}s;"></div>`;
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
            const end = start + perLoop;
            const sectionNodes = nodes.slice(start, end);
            const completedCount = sectionNodes.filter(n => n.status === 'completed').length;
            const hasActive = sectionNodes.some(n => n.status === 'active');
            const fillPct = Math.min(100, completedCount * 20);
            const mastered = fillPct >= 100;
            const started = completedCount > 0 || hasActive;
            const char = cleanMascots[loop] || cleanMascots[0];
            const sectionTitle = sectionTitles[loop] || `Vòng ${loop + 1}`;
            const nodeIcon = mastered ? ICON_CHECK : (started ? ICON_SPARKLE : ICON_LOCK);

            const segments = Array.from({ length: perLoop }, (_, i) => {
                const on = i < completedCount ? 'on' : '';
                return `<span class="${on}"></span>`;
            }).join('');

            timelineHtml += `
                <section class="mb-section" data-loop="${loop + 1}">
                    <div class="mb-row mb-head-row mb-down ${started ? 'mb-down-on' : ''}">
                        <div class="mb-rail">
                            <span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span>
                        </div>
                        <div class="mb-head">
                            <div class="mb-head-text">
                                <span class="mb-head-eyebrow">Vòng ${loop + 1} • 5 chặng thám hiểm</span>
                                <h3 class="mb-head-title">${sectionTitle}</h3>
                                <div class="mb-segbar ${mastered ? 'is-mastered' : ''}">${segments}</div>
                                <span class="mb-head-meta">${char.name} · ${mastered ? 'Đã tô 5/5 hoàn chỉnh 🏆' : `đã tô ${completedCount}/5`}</span>
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
                const isLast = (i === sectionNodes.length - 1);
                timelineHtml += renderMysteryLessonRow(node, loop, isLast);
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
                    <div class="mb-rail">
                        <span class="mb-dot">${ICON_CHECK}</span>
                    </div>
                    <div class="mb-card" onclick="openStoryReaderScreen()" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5 mb-0.5">
                                <span class="age-badge ${ageCls}">${ageBadge}</span>
                                <span class="mb-card-kicker">Hoàn thành • 5 phút</span>
                            </div>
                            <h4 class="mb-card-title">${node.title}</h4>
                            <span class="mb-card-cta is-review">Ôn lại ↺</span>
                        </div>
                        <div class="mb-thumb">
                            <img src="${node.img}" alt="${node.title}" loading="lazy" />
                        </div>
                    </div>
                </div>
            `;
        }

        if (state === 'active') {
            if (!isRevealed) {
                return `
                    <div class="mb-row ${railCls} mb-state-active mb-state-mystery" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                        <div class="mb-rail">
                            <span class="mb-dot mb-dot-mystery">?</span>
                        </div>
                        <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num})" role="button" tabindex="0" title="Chạm để chọn thể loại và lật mở bài học!">
                            <div class="mystery-shimmer-sweep"></div>
                            <div class="mb-card-body relative z-10">
                                <div class="flex items-center gap-1.5 mb-0.5">
                                    <span class="age-badge age-badge-15">🎲 BÍ ẨN</span>
                                    <span class="mb-card-kicker font-black" style="color: var(--rm-amber-text, #D97706);">Ngã rẽ định mệnh • 5 phút</span>
                                </div>
                                <h4 class="mb-card-title font-extrabold text-[15px] leading-tight">
                                    Chặng ${num} • Chạm Để Khám Phá
                                </h4>
                                <span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">
                                    Lật mở thẻ bài ✨
                                </span>
                            </div>
                            <div class="mb-thumb mb-thumb-mystery relative z-10">
                                <span class="mystery-qmark-icon">?</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const { genreKey, story } = revealedData;
                const genre = catalog[genreKey] || catalog.travel_daily;

                return `
                    <div class="mb-row ${railCls} mb-state-active" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                        <div class="mb-rail">
                            <span class="mb-dot"><span class="mb-active-lumi-companion">🦊</span></span>
                        </div>
                        <div class="mb-card" onclick="launchRevealedLesson(${num})" role="button" tabindex="0">
                            <div class="mb-card-body">
                                <div class="flex items-center justify-between gap-1 mb-0.5">
                                    <div class="flex items-center gap-1.5">
                                        <span class="age-badge ${genre.ageClass}">${story.age}</span>
                                        <span class="mb-card-kicker text-[10.5px]">${genre.icon} ${genre.name}</span>
                                    </div>
                                    <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num})" class="text-[10.5px] font-bold hover:underline" style="color: var(--rm-amber-text, #D97706);" title="Chọn lại thể loại">
                                        Đổi ↺
                                    </button>
                                </div>
                                <h4 class="mb-card-title font-extrabold">${story.title}</h4>
                                <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] line-clamp-1 mb-1">${story.subtitle}</p>
                                <span class="mb-card-cta">Học ngay ${ICON_PLAY}</span>
                            </div>
                            <div class="mb-thumb">
                                <img src="${story.img}" alt="${story.title}" loading="lazy" />
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        if (type === 'chest') {
            return `
                <div class="mb-row ${railCls} mb-type-chest mb-state-locked">
                    <div class="mb-rail"><span class="mb-dot"></span></div>
                    <div class="mb-card" aria-disabled="true">
                        <div class="mb-card-body">
                            <span class="mb-card-kicker">Rương Kho Báu • +150 XP</span>
                            <h4 class="mb-card-title">${node.title}</h4>
                        </div>
                        <div class="mb-thumb">
                            <img src="${node.img}" alt="Rương kho báu" />
                            <div class="mb-thumb-badge">🔒</div>
                        </div>
                    </div>
                </div>
            `;
        }

        if (type === 'boss') {
            return `
                <div class="mb-row mb-type-boss mb-state-locked mt-4">
                    <div class="mb-rail"><span class="mb-dot"></span></div>
                    <div class="mb-card" aria-disabled="true">
                        <div class="mb-card-body">
                            <span class="mb-card-kicker">Thử Thách Trùm Cuối • 8 phút</span>
                            <h4 class="mb-card-title">${node.title}</h4>
                        </div>
                        <div class="mb-thumb">
                            <img src="${node.img}" alt="" />
                            <div class="mb-thumb-badge">🔒</div>
                            <span class="mb-crown">👑</span>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="mb-row ${railCls} mb-state-locked">
                <div class="mb-rail"><span class="mb-dot"></span></div>
                <div class="mb-card" aria-disabled="true">
                    <div class="mb-card-body">
                        <span class="mb-card-kicker">Chặng ${num} • Đang khóa</span>
                        <h4 class="mb-card-title">${node.title}</h4>
                    </div>
                    <div class="mb-thumb">
                        <img src="${node.img}" alt="" />
                        <div class="mb-thumb-badge">🔒</div>
                    </div>
                </div>
            </div>
        `;
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
                    <span class="mb-nextbar-kicker">${isRevealed ? 'Tiếp tục bài học' : 'Ngã rẽ định mệnh'} · Chặng ${activeNode.num}</span>
                    <span class="mb-nextbar-title">${isRevealed ? story.title : 'Chạm để lật mở thẻ bài bí ẩn'}</span>
                    <span class="mb-nextbar-sub">${isRevealed ? story.subtitle : 'Chọn thể loại ngụ ngôn, du ký hoặc công sở'}</span>
                </div>
                <button type="button" class="mb-nextbar-go" aria-label="Tiếp tục">
                    ${isRevealed ? ICON_PLAY : '✨'}
                </button>
            </div>
        `;
    }

    let currentPickingNodeNum = 3;

    function openRoadmapGenrePickerSheet(nodeNum = 3) {
        currentPickingNodeNum = nodeNum;
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (!sheet) return;
        renderGenreCardsList();
        sheet.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }
    }

    function closeRoadmapGenrePickerSheet() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (!sheet) return;
        sheet.classList.add('hidden');
    }

    function renderGenreCardsList() {
        const container = document.getElementById('genreCardsListContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('kids_fable')">
                <div class="genre-choice-icon-box" style="background: rgba(184,209,102,0.16); border-color: rgba(184,209,102,0.4);">🐾</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Đồng Thoại & Ngụ Ngôn</span>
                        <span class="age-badge age-badge-3">3+ • All Ages</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Bài học cuộc sống, động vật thông thái & ngữ cảnh ấm áp.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('travel_daily')">
                <div class="genre-choice-icon-box" style="background: rgba(251,191,36,0.16); border-color: rgba(251,191,36,0.4);">✈️</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Du Ký & Đời Thường</span>
                        <span class="age-badge age-badge-15">15+ • Thực Tế</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Quán cà phê Tokyo dưới mưa, bắt chuyện người lạ, hỏi giờ tàu.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('pro_business')">
                <div class="genre-choice-icon-box" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.38);">💼</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Công Sở & Đàm Phán</span>
                        <span class="age-badge age-badge-18">18+ • Người Lớn</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Thương thảo hợp đồng, giải quyết xung đột dự án & đối đáp sắc bén.</p>
                </div>
            </div>
            <div class="genre-choice-card genre-choice-card-random" onclick="handleSelectGenreAndReveal('mystery_random')">
                <div class="genre-choice-icon-box" style="background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.45);">🎲</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-black text-[var(--rm-on-surface)] tracking-tight">Chiếc Hộp Pandora</span>
                        <span class="age-badge age-badge-10">🎲 Random</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Để định mệnh lựa chọn! Tự động quét và khớp câu chuyện ngẫu nhiên.</p>
                </div>
            </div>
        `;
    }

    function handleSelectGenreAndReveal(genreKey) {
        closeRoadmapGenrePickerSheet();
        const num = currentPickingNodeNum;
        const catalog = getGenreCatalog();

        let chosenKey = genreKey;
        if (chosenKey === 'mystery_random') {
            const availableKeys = ['kids_fable', 'travel_daily', 'pro_business'];
            chosenKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        }

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
                if (typeof showDictToast === 'function') {
                    showDictToast(`✨ Đã mở khóa: "${matchedStory.title}" (${matchedStory.age})!`);
                }
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
            chapterNumber: nodeNum,
            title: story.title,
            subtitle: story.subtitle,
            category: `CHẶNG BÍ ẨN • ${story.age}`,
            desc: story.scenario,
            image: story.img,
            thumbnail: story.img,
            duration: story.duration,
            progressPill: `Chặng ${nodeNum}/10`,
            progressPercent: nodeNum * 10
        };

        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen(lessonPayload);
            return;
        }
        if (typeof window.openLessonIntroScreen === 'function') {
            window.openLessonIntroScreen(0, lessonPayload);
        }
    }

    window.openMysteryRoadmap = openMysteryRoadmap;
    window.closeMysteryRoadmap = closeMysteryRoadmap;
    window.switchToClassicRoadmap = switchToClassicRoadmap;
    window.openRoadmapGenrePickerSheet = openRoadmapGenrePickerSheet;
    window.closeRoadmapGenrePickerSheet = closeRoadmapGenrePickerSheet;
    window.handleSelectGenreAndReveal = handleSelectGenreAndReveal;
    window.launchRevealedLesson = launchRevealedLesson;
})(window);
