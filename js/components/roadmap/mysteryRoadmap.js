// ========================================================
// 🗺️ MYSTERY ROADMAP CONTROLLER v3.0 (ADAPTIVE RPG & GENRE MATCHMAKING)
// Style: Kế thừa 100% Timeline, Sections & Linh vật bản cũ
// Item & Flow: Dấu hỏi Bí ẩn ?, Thẻ bài lật mở 3D & The Crossroads Sheet
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    // ---------------------------------------------------------
    // 1. DANH MỤC THỂ LOẠI (GENRE CATALOG & AGE RATINGS)
    // ---------------------------------------------------------
    const GENRE_CATALOG = {
        kids_fable: {
            id: 'kids_fable',
            icon: '🐾',
            name: 'Đồng Thoại & Ngụ Ngôn',
            ageBadge: '3+',
            ageClass: 'age-badge-3',
            color: '#B8D166',
            desc: 'Ngụ ngôn ngắn, động vật thông thái, hạt giống tử tế & bài học ý nghĩa.',
            stories: [
                {
                    title: "Ngụ ngôn: Rùa và Thỏ",
                    subtitle: "Bài học về sự kiên trì",
                    age: "3+",
                    img: "assets/cards/lumi_farmer_strawhat.jpg",
                    scenario: "Cuộc đua vô tiền khoáng hậu giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh tại thung lũng mùa xuân.",
                    duration: "4 phút"
                },
                {
                    title: "Ngụ ngôn: Quạ và Bình Nước",
                    subtitle: "Sự thông minh và kiên nhẫn",
                    age: "3+",
                    img: "assets/cards/lumi_melody_arena.jpg",
                    scenario: "Chú Quạ khát nước khéo léo dùng sỏi để nâng mực nước trong chiếc bình sâu đáy.",
                    duration: "3 phút"
                }
            ]
        },
        travel_daily: {
            id: 'travel_daily',
            icon: '✈️',
            name: 'Du Ký & Đời Thường',
            ageBadge: '15+',
            ageClass: 'age-badge-15',
            color: '#FBBF24',
            desc: 'Trú mưa quán cà phê Tokyo, chuyến tàu đêm 00:00, hỏi đường & ẩm thực phố.',
            stories: [
                {
                    title: "Mưa Dưới Mái Hiên",
                    subtitle: "Quán cà phê góc phố Tokyo",
                    age: "15+",
                    img: "assets/cards/lumi_rain_coffee_eaves.jpg",
                    scenario: "Trú mưa bên hiên quán nhỏ & gọi một ly latte ấm nóng. Nét tinh tế trong giao tiếp bản xứ.",
                    duration: "5 phút"
                },
                {
                    title: "Chuyến Tàu Đêm Nửa Đêm",
                    subtitle: "Sân ga mù sương 00:00",
                    age: "15+",
                    img: "assets/cards/lumi_train_station_night.jpg",
                    scenario: "Hơi nước rít lên tại Ke ga số 1 khi đồng hồ điểm qua nửa đêm. Hỏi giờ và đọc biển báo tàu.",
                    duration: "5 phút"
                }
            ]
        },
        pro_business: {
            id: 'pro_business',
            icon: '💼',
            name: 'Công Sở & Đàm Phán',
            ageBadge: '18+',
            ageClass: 'age-badge-18',
            color: '#FB7185',
            desc: 'Phỏng vấn công nghệ, giải quyết xung đột dự án, đàm phán hợp đồng sắc bén.',
            stories: [
                {
                    title: "Bản Đàm Phán Đêm Muộn",
                    subtitle: "Ký kết thương vụ quốc tế",
                    age: "18+",
                    img: "assets/cards/lumi_review_flashcards.jpg",
                    scenario: "Thương thảo điều khoản hợp đồng gấp trước thời hạn đóng phiên giao dịch.",
                    duration: "7 phút"
                },
                {
                    title: "Chiếc Thẻ Nhầm Tên",
                    subtitle: "Sảnh đăng ký hội nghị AI",
                    age: "18+",
                    img: "assets/cards/pixar_night_farm_scenery.jpg",
                    scenario: "Xử lý tình huống nhầm lẫn thông tin đại biểu lịch thiệp tại hội nghị quốc tế.",
                    duration: "6 phút"
                }
            ]
        },
        mystery_random: {
            id: 'mystery_random',
            icon: '🎲',
            name: 'Chiếc Hộp Pandora',
            ageBadge: '🎲 Tùy biến',
            ageClass: 'age-badge-10',
            color: '#38BDF8',
            desc: 'Để số phận quyết định! Hệ thống sẽ chọn ngẫu nhiên một câu chuyện bất ngờ nhất.',
            stories: []
        }
    };

    const STORAGE_KEY = 'vibecard_mystery_roadmap_v3_state';
    let mysteryState = {
        activeNodeNum: 3,
        revealedStories: {} // nodeNum -> { genreKey, story }
    };

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

    // ---------------------------------------------------------
    // 2. MỞ / ĐÓNG MÀN HÌNH ROADMAP MỚI
    // ---------------------------------------------------------
    function openMysteryRoadmap() {
        loadSavedState();
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;

        const classicScreen = document.getElementById('screenParchmentRoadmap');
        if (classicScreen && !classicScreen.classList.contains('hidden')) {
            classicScreen.classList.add('hidden');
        }

        renderMysteryAmbientRain();
        renderMysteryRoadmapTimeline();
        screen.classList.remove('hidden');

        requestAnimationFrame(() => {
            screen.classList.remove('translate-x-full');
        });

        setTimeout(() => scrollMysteryRoadmapToActive(), 300);

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

    function scrollMysteryRoadmapToActive() {
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        if (!scrollArea) return;
        const target = scrollArea.querySelector('[data-roadmap-active="1"]');
        if (target) {
            const delta = target.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top;
            const areaHeight = scrollArea.clientHeight || 500;
            const top = Math.max(0, scrollArea.scrollTop + delta - (areaHeight / 2 - 45));
            scrollArea.scrollTo({ top, behavior: 'smooth' });
        }
    }

    // ---------------------------------------------------------
    // 3. RENDER TIMELINE: GIỮ 100% STYLE BẢN CŨ, ĐỔI ITEM & FLOW
    // ---------------------------------------------------------
    function renderMysteryRoadmapTimeline() {
        const container = document.getElementById('mysteryRoadmapNodesContainer');
        if (!container) return;

        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[0])
            ? window.roadmapChaptersData[0]
            : { nodes: [] };

        const nodes = chapter.nodes || [];
        const characters = chapter.characters || [
            { name: 'Thần Rừng Lumi', img: 'assets/cards/lumi_avatar_portrait_clean.png', quote: 'Tô sáng từng vạch màu để đánh thức phép thuật rừng sâu!' },
            { name: 'Billy Possum', img: 'assets/cards/billy_possum_crop_test.png', quote: 'Cố lên! Vòng 2 sẽ mở ra câu chuyện huyền ảo!' }
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
            const char = characters[loop] || characters[0];
            const sectionTitle = sectionTitles[loop] || `Vòng ${loop + 1}`;

            // Segments 5 vạch tiến độ
            const segments = Array.from({ length: perLoop }, (_, i) => {
                const on = i < completedCount ? 'on' : '';
                return `<span class="${on}"></span>`;
            }).join('');

            // Vòng Section Header giống 100% bản cũ
            timelineHtml += `
                <section class="mb-section" data-loop="${loop + 1}">
                    <div class="mb-row mb-head-row mb-down ${started ? 'mb-down-on' : ''}">
                        <div class="mb-rail">
                            <span class="mb-section-node ${started ? '' : 'is-locked'}">
                                ${mastered ? '✓' : (started ? '✦' : '🔒')}
                            </span>
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

            // Render từng Item bài học
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

    // ---------------------------------------------------------
    // 4. RENDER TỪNG ITEM (MYSTERY BOX, AGE BADGES & REVEAL)
    // ---------------------------------------------------------
    function renderMysteryLessonRow(node, loopIdx, isLastInSection) {
        const state = node.status;
        const type = node.type || 'star';
        const num = node.num;
        const railCls = isLastInSection ? 'mb-up mb-up-on mb-down-long' : 'mb-up mb-up-on mb-down mb-down-on';
        const revealedData = mysteryState.revealedStories[num];
        const isRevealed = !!revealedData;

        // A. ITEM HOÀN THÀNH (COMPLETED) -> Card bản cũ + Age Badge + Ôn lại
        if (state === 'completed') {
            const ageBadge = (node.display_badges && node.display_badges[0]) || '15+';
            const ageCls = ageBadge.includes('18') ? 'age-badge-18' : (ageBadge.includes('3') ? 'age-badge-3' : 'age-badge-15');

            return `
                <div class="mb-row ${railCls} mb-state-completed mb-type-${type}">
                    <div class="mb-rail">
                        <span class="mb-dot">✓</span>
                    </div>
                    <div class="mb-card" onclick="openStoryReaderScreen()" role="button" tabindex="0">
                        <div class="mb-card-body">
                            <div class="flex items-center gap-1.5 mb-1">
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

        // B. ITEM ĐANG HỌC (ACTIVE) -> Dấu hỏi Bí ẩn hoặc Thẻ lật mở
        if (state === 'active') {
            if (!isRevealed) {
                // Trạng thái Bí ẩn Dấu hỏi ?
                return `
                    <div class="mb-row ${railCls} mb-state-active mb-state-mystery" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                        <div class="mb-rail">
                            <span class="mb-dot mb-dot-mystery" style="color:#FEF3C7; font-weight:900; font-size:13px;">?</span>
                        </div>
                        <div class="mb-card mb-card-mystery" onclick="openRoadmapGenrePickerSheet(${num})" role="button" tabindex="0" title="Chạm để chọn thể loại và lật mở bài học!">
                            <div class="mystery-shimmer-sweep"></div>
                            <div class="mb-card-body relative z-10">
                                <div class="flex items-center gap-1.5 mb-1">
                                    <span class="age-badge age-badge-15">🎲 BÍ ẨN</span>
                                    <span class="mb-card-kicker text-[#FBBF24] font-black">Ngã rẽ định mệnh • 5 phút</span>
                                </div>
                                <h4 class="mb-card-title text-white font-extrabold text-[15px] sm:text-[16px] leading-tight">
                                    Chặng ${num} • Chạm Để Khám Phá
                                </h4>
                                <span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:900;">
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
                // Trạng thái đã Lật mở thành công
                const { genreKey, story } = revealedData;
                const genre = GENRE_CATALOG[genreKey] || GENRE_CATALOG.travel_daily;

                return `
                    <div class="mb-row ${railCls} mb-state-active" id="mysteryNodeRow-${num}" data-roadmap-active="1">
                        <div class="mb-rail">
                            <span class="mb-dot">🦊</span>
                        </div>
                        <div class="mb-card border-2 border-[var(--m3-primary)] shadow-[0_0_25px_rgba(184,209,102,0.35)]" onclick="launchRevealedLesson(${num})" role="button" tabindex="0">
                            <div class="mb-card-body">
                                <div class="flex items-center justify-between gap-1 mb-1">
                                    <div class="flex items-center gap-1.5">
                                        <span class="age-badge ${genre.ageClass}">${story.age}</span>
                                        <span class="text-[10px] font-bold text-[#D4EE7F]">${genre.icon} ${genre.name}</span>
                                    </div>
                                    <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${num})" class="text-[10.5px] text-[#FBBF24] hover:underline font-bold" title="Chọn lại thể loại">
                                        Đổi ↺
                                    </button>
                                </div>
                                <h4 class="mb-card-title text-white font-black">${story.title}</h4>
                                <p class="text-[11.5px] text-white/70 line-clamp-1 mb-1.5">${story.subtitle}</p>
                                <span class="mb-card-cta">Học ngay ▶</span>
                            </div>
                            <div class="mb-thumb">
                                <img src="${story.img}" alt="${story.title}" loading="lazy" />
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // C. ITEM RƯƠNG THƯỞNG (CHEST) & TRÙM CUỐI (BOSS)
        if (type === 'chest') {
            return `
                <div class="mb-row ${railCls} mb-type-chest mb-state-locked opacity-65">
                    <div class="mb-rail"><span class="mb-dot">🎁</span></div>
                    <div class="mb-card" aria-disabled="true">
                        <div class="mb-card-body">
                            <span class="mb-card-kicker text-[#FBBF24]">Rương Kho Báu • +150 XP</span>
                            <h4 class="mb-card-title text-[#FEF3C7]">${node.title}</h4>
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
                <div class="mb-row mb-type-boss mb-state-locked opacity-50 mt-4">
                    <div class="mb-rail"><span class="mb-dot">👑</span></div>
                    <div class="mb-card" aria-disabled="true">
                        <div class="mb-card-body">
                            <span class="mb-card-kicker text-rose-400">Thử Thách Trùm Cuối • 8 phút</span>
                            <h4 class="mb-card-title text-white/60">${node.title}</h4>
                        </div>
                        <div class="mb-thumb">
                            <img src="${node.img}" class="grayscale opacity-40" alt="" />
                            <span class="mb-crown">👑</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // D. ITEM KHÓA TRONG SƯƠNG MÙ (FOG OF WAR LOCKED)
        return `
            <div class="mb-row ${railCls} mb-state-locked opacity-50">
                <div class="mb-rail"><span class="mb-dot">🔒</span></div>
                <div class="mb-card" aria-disabled="true">
                    <div class="mb-card-body">
                        <span class="mb-card-kicker text-white/40">Chặng ${num} • Đang khóa</span>
                        <h4 class="mb-card-title text-white/50">${node.title}</h4>
                    </div>
                    <div class="mb-thumb">
                        <img src="${node.img}" class="grayscale opacity-40" alt="" />
                        <div class="mb-thumb-badge">🔒</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ---------------------------------------------------------
    // 5. THANH ĐIỀU HƯỚNG ĐÁY MÀN HÌNH (BOTTOM NEXT BAR)
    // ---------------------------------------------------------
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
                    ${isRevealed ? '▶' : '✨'}
                </button>
            </div>
        `;
    }

    // ---------------------------------------------------------
    // 6. THE CROSSROADS BOTTOM SHEET: CHỌN THỂ LOẠI
    // ---------------------------------------------------------
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
                <div class="genre-choice-icon-box" style="background: rgba(184,209,102,0.15); border-color: rgba(184,209,102,0.35);">🐾</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-white tracking-tight">Đồng Thoại & Ngụ Ngôn</span>
                        <span class="age-badge age-badge-3">3+ • All Ages</span>
                    </div>
                    <p class="text-[11.5px] text-white/60 leading-relaxed">Bài học cuộc sống, động vật thông thái & ngữ cảnh ấm áp.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('travel_daily')">
                <div class="genre-choice-icon-box" style="background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.35);">✈️</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-white tracking-tight">Du Ký & Đời Thường</span>
                        <span class="age-badge age-badge-15">15+ • Thực Tế</span>
                    </div>
                    <p class="text-[11.5px] text-white/60 leading-relaxed">Quán cà phê Tokyo dưới mưa, bắt chuyện người lạ, hỏi giờ tàu.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('pro_business')">
                <div class="genre-choice-icon-box" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.35);">💼</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-white tracking-tight">Công Sở & Đàm Phán</span>
                        <span class="age-badge age-badge-18">18+ • Người Lớn</span>
                    </div>
                    <p class="text-[11.5px] text-white/60 leading-relaxed">Thương thảo hợp đồng, giải quyết xung đột dự án & đối đáp sắc bén.</p>
                </div>
            </div>
            <div class="genre-choice-card genre-choice-card-random" onclick="handleSelectGenreAndReveal('mystery_random')">
                <div class="genre-choice-icon-box" style="background: rgba(56,189,248,0.2); border-color: rgba(56,189,248,0.5);">🎲</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-black text-[#FEF3C7] tracking-tight">Chiếc Hộp Pandora</span>
                        <span class="age-badge age-badge-10">🎲 Random</span>
                    </div>
                    <p class="text-[11.5px] text-white/70 leading-relaxed">Để định mệnh lựa chọn! Tự động quét và khớp câu chuyện ngẫu nhiên.</p>
                </div>
            </div>
        `;
    }

    // ---------------------------------------------------------
    // 7. MATCHMAKING & HIỆU ỨNG LẬT MỞ THẺ BÀI (CARD FLIP REVEAL)
    // ---------------------------------------------------------
    function handleSelectGenreAndReveal(genreKey) {
        closeRoadmapGenrePickerSheet();
        const num = currentPickingNodeNum;

        let chosenKey = genreKey;
        if (chosenKey === 'mystery_random') {
            const availableKeys = ['kids_fable', 'travel_daily', 'pro_business'];
            chosenKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        }

        const genreData = GENRE_CATALOG[chosenKey] || GENRE_CATALOG.travel_daily;
        const matchedStory = genreData.stories[Math.floor(Math.random() * genreData.stories.length)];

        mysteryState.revealedStories[num] = {
            genreKey: chosenKey,
            story: matchedStory
        };
        saveState();

        // Chạy hiệu ứng lật thẻ 3D tại node đó trên timeline
        const row = document.getElementById(`mysteryNodeRow-${num}`);
        if (row) {
            row.classList.add('mb-card-flip-reveal');
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(4);
            }
            setTimeout(() => {
                renderMysteryRoadmapTimeline();
                if (typeof showDictToast === 'function') {
                    showDictToast(`✨ Đã mở khóa: "${matchedStory.title}" (${matchedStory.age})!`);
                }
                // Tự động mở bài học sau khi lật mở
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

        // Ưu tiên mở trực tiếp Màn hình Đọc truyện Story to Card chuẩn 1:1 Android Pixel
        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen(lessonPayload);
            return;
        }
        if (typeof window.openLessonIntroScreen === 'function') {
            window.openLessonIntroScreen(0, lessonPayload);
        } else if (typeof openLessonIntroScreen === 'function') {
            openLessonIntroScreen(0, lessonPayload);
        }
    }

    // Expose APIs
    window.openMysteryRoadmap = openMysteryRoadmap;
    window.closeMysteryRoadmap = closeMysteryRoadmap;
    window.switchToClassicRoadmap = switchToClassicRoadmap;
    window.openRoadmapGenrePickerSheet = openRoadmapGenrePickerSheet;
    window.closeRoadmapGenrePickerSheet = closeRoadmapGenrePickerSheet;
    window.handleSelectGenreAndReveal = handleSelectGenreAndReveal;
    window.launchRevealedLesson = launchRevealedLesson;

})(window);
