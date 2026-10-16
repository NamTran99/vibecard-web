// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP — BACKEND STORY CATALOG & TRACKLIST
// Ceiling: < 350 lines | Standard: Apple/Linear Mobile Sheet V4.0
// ========================================================

(function (window) {
    'use strict';

    const GENRE_META = {
        all:          { id: 'all',          name: 'Tất cả' },
        fable:        { id: 'fable',        name: 'Ngụ ngôn' },
        travel_daily: { id: 'travel_daily', name: 'Du ký' },
        pro_business: { id: 'pro_business', name: 'Công sở' },
        mystery:      { id: 'mystery',      name: 'Kỳ bí' }
    };

    const DIFFICULTY_META = {
        all:    { id: 'all',    label: 'Mọi mức', short: 'Tất cả', dotCls: 'diff-dot-all',  badgeCls: 'age-badge-15' },
        easy:   { id: 'easy',   label: 'Dễ · 3p',  short: 'Dễ',    dotCls: 'diff-dot-easy', badgeCls: 'age-badge-3'  },
        medium: { id: 'medium', label: 'Vừa · 5p', short: 'Vừa',   dotCls: 'diff-dot-med',  badgeCls: 'age-badge-15' },
        hard:   { id: 'hard',   label: 'Khó · 7p', short: 'Khó',   dotCls: 'diff-dot-hard', badgeCls: 'age-badge-18' }
    };

    function resolveRoadmapDifficulty(node, story) {
        const raw = String((story && (story.difficulty || story.age)) || (node && ((node.tags && node.tags.age) || (node.display_badges && node.display_badges[0]))) || '').toLowerCase();
        if (raw.includes('easy') || raw.includes('dễ') || raw.includes('cơ bản') || raw === '3+' || raw === '10+' || (node && node.type === 'book')) {
            return DIFFICULTY_META.easy;
        }
        if (raw.includes('hard') || raw.includes('khó') || raw.includes('nâng cao') || raw === '18+') {
            return DIFFICULTY_META.hard;
        }
        return DIFFICULTY_META.medium;
    }

    const ROADMAP_SLOT_FLAVORS = {
        3: { icon: '✦',  cards: ['🦊', '✈️', '💼'], diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Tự chọn' },
        4: { icon: '☕', cards: ['☕', '🌧️', '🌿'], diffShort: 'Dễ',  badgeCls: 'age-badge-3',  themeTag: 'Đời thường' },
        6: { icon: '✈️', cards: ['✈️', '🍜', '🗺️'], diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Du ký' },
        7: { icon: '💼', cards: ['💼', '💻', '🤝'], diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Công sở' },
        8: { icon: '🦊', cards: ['🦊', '🌙', '🎭'], diffShort: 'Khó', badgeCls: 'age-badge-18', themeTag: 'Kể chuyện' },
        9: { icon: '🔥', cards: ['🔥', '⚡', '🏆'], diffShort: 'Khó', badgeCls: 'age-badge-18', themeTag: 'Nâng cao' }
    };

    function getRoadmapSlotFlavor(nodeNum) {
        return ROADMAP_SLOT_FLAVORS[nodeNum] || {
            icon: '✦', cards: ['🦊', '✈️', '💼'], diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Tự chọn'
        };
    }

    const FALLBACK_STORIES = [
        {
            id: 'topic_003',
            title: 'Rùa và Thỏ',
            subtitle: 'Bài học về sự kiên trì',
            genre: 'fable',
            difficulty: 'easy',
            age: 'Độ khó: Dễ',
            duration: '3 phút',
            img: 'assets/cards/lumi_farmer_strawhat.jpg',
            scenario: 'Cuộc đua vô tiền khoáng hậu giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh tại thung lũng mùa xuân.'
        },
        {
            id: 'topic_006',
            title: 'Quạ và Bình Nước',
            subtitle: 'Sự thông minh và kiên nhẫn',
            genre: 'fable',
            difficulty: 'easy',
            age: 'Độ khó: Dễ',
            duration: '3 phút',
            img: 'assets/cards/lumi_melody_arena.jpg',
            scenario: 'Chú Quạ khát nước khéo léo dùng sỏi để nâng mực nước trong chiếc bình sâu đáy.'
        },
        {
            id: 'topic_009',
            title: 'Cậu Bé Chăn Cừu',
            subtitle: 'Giá trị của sự trung thực',
            genre: 'fable',
            difficulty: 'easy',
            age: 'Độ khó: Dễ',
            duration: '4 phút',
            img: 'assets/cards/lumi_review_flashcards.jpg',
            scenario: 'Những ngày chăn cừu trên đồi cỏ và bài học sâu sắc về lòng tin.'
        },
        {
            id: 'topic_001',
            title: 'Mưa Dưới Mái Hiên',
            subtitle: 'Quán cà phê góc phố Tokyo',
            genre: 'travel_daily',
            difficulty: 'medium',
            age: 'Độ khó: Vừa',
            duration: '5 phút',
            img: 'assets/cards/lumi_rain_coffee_eaves.jpg',
            scenario: 'Trú mưa bên hiên quán nhỏ & gọi một ly latte ấm nóng.'
        },
        {
            id: 'topic_004',
            title: 'Chuyến Tàu Nửa Đêm',
            subtitle: 'Sân ga mù sương 00:00',
            genre: 'travel_daily',
            difficulty: 'medium',
            age: 'Độ khó: Vừa',
            duration: '5 phút',
            img: 'assets/cards/lumi_train_station_night.jpg',
            scenario: 'Hơi nước rít lên tại Ke ga số 1 khi đồng hồ điểm qua nửa đêm.'
        },
        {
            id: 'topic_007',
            title: 'Quán Mì Hẻm Nhỏ',
            subtitle: 'Ẩm thực đêm & hỏi đường',
            genre: 'travel_daily',
            difficulty: 'medium',
            age: 'Độ khó: Vừa',
            duration: '5 phút',
            img: 'assets/cards/pixar_night_farm_scenery.jpg',
            scenario: 'Gọi món đặc sản địa phương và trò chuyện cùng đầu bếp bản xứ.'
        },
        {
            id: 'topic_002',
            title: 'Chiếc Thẻ Nhầm Tên',
            subtitle: 'Sảnh hội nghị AI quốc tế',
            genre: 'pro_business',
            difficulty: 'hard',
            age: 'Độ khó: Khó',
            duration: '6 phút',
            img: 'assets/cards/lumi_review_flashcards.jpg',
            scenario: 'Xử lý tình huống nhầm lẫn thông tin đại biểu lịch thiệp trước giờ khai mạc.'
        },
        {
            id: 'topic_010',
            title: 'Bản Đàm Phán Đêm Muộn',
            subtitle: 'Ký kết thương vụ chiến lược',
            genre: 'pro_business',
            difficulty: 'hard',
            age: 'Độ khó: Khó',
            duration: '7 phút',
            img: 'assets/cards/lumi_progress_celebration.jpg',
            scenario: 'Thương thảo điều khoản hợp đồng gấp trước thời hạn đóng phiên.'
        },
        {
            id: 'topic_008',
            title: 'Bức Thư Trong Rương Cổ',
            subtitle: 'Bí mật dưới ánh trăng',
            genre: 'mystery',
            difficulty: 'hard',
            age: 'Độ khó: Khó',
            duration: '7 phút',
            img: 'assets/cards/lumi_farmer_night.png',
            scenario: 'Giải mã những dòng chữ cổ để lại trong căn gác mái đầy bụi thời gian.'
        }
    ];

    let cachedStoryPool = null;
    let activeFilterGenre = 'all';
    let activeFilterDifficulty = 'all';

    function cleanStoryTitle(raw) {
        return String(raw || '').replace(/^(ngụ ngôn|cổ tích)\s*:\s*/i, '').trim();
    }

    function normalizeStoryKey(title) {
        return cleanStoryTitle(title).toLowerCase();
    }

    function classifyNodeToStory(n) {
        const rawTitle = String(n.title || '');
        const title = cleanStoryTitle(rawTitle);
        const rawGenre = (n.tags && n.tags.genre) || '';
        const isFable = rawTitle.toLowerCase().includes('ngụ ngôn') || rawTitle.toLowerCase().includes('cổ tích') || rawGenre === 'fable' || n.type === 'book';
        const isWork = rawGenre === 'dialogue_work' || (n.tags && n.tags.age === '18+') || title.includes('Hội Nghị') || title.includes('Sóng') || title.includes('Thẻ');
        const isMystery = title.includes('Bí Ẩn') || title.includes('Đêm') || title.includes('Lạc');

        let genre = 'travel_daily';
        if (isFable) genre = 'fable';
        else if (isWork) genre = 'pro_business';
        else if (isMystery) genre = 'mystery';

        let difficulty = 'medium';
        if (genre === 'fable') difficulty = 'easy';
        else if (genre === 'pro_business' || genre === 'mystery') difficulty = 'hard';

        const diffMeta = DIFFICULTY_META[difficulty];
        const duration = difficulty === 'easy' ? '3 phút' : (difficulty === 'hard' ? '7 phút' : '5 phút');

        return {
            id: n.topicId || `node_${n.num}_${n.day || 1}`,
            title: title,
            subtitle: n.subtitle || '',
            genre: genre,
            difficulty: difficulty,
            age: diffMeta.short,
            duration: duration,
            img: n.img || 'assets/cards/lumi_rain_coffee_eaves.jpg',
            scenario: n.scenario || n.purpose || ''
        };
    }

    function getFullStoryPool() {
        if (cachedStoryPool && cachedStoryPool.length > 0) return cachedStoryPool;

        const map = new Map();
        FALLBACK_STORIES.forEach(s => map.set(normalizeStoryKey(s.title), s));

        const chapters = window.REAL_ROADMAP_CHAPTERS || window.roadmapChaptersData || [];
        chapters.forEach(ch => {
            (ch.nodes || []).forEach(n => {
                if (!n || !n.title || n.type === 'chest' || n.type === 'boss') return;
                const key = normalizeStoryKey(n.title);
                if (!map.has(key)) {
                    map.set(key, classifyNodeToStory(n));
                }
            });
        });

        cachedStoryPool = Array.from(map.values());
        return cachedStoryPool;
    }

    async function syncBackendStoryCatalog() {
        if (typeof fetch !== 'function') return;
        const baseUrl = window.API_BASE_URL || 'https://mindcards-lessons.mindcards.workers.dev';
        try {
            const resp = await fetch(`${baseUrl}/api/v1/lessons/roadmap?displayLanguage=vi&contentLanguage=en`);
            if (!resp.ok) return;
            const data = await resp.json();
            const stages = data.stages || (data.data && data.data.stages) || [];
            if (!Array.isArray(stages) || !stages.length) return;

            const pool = getFullStoryPool();
            const existingKeys = new Set(pool.map(s => normalizeStoryKey(s.title)));

            stages.forEach(st => {
                (st.lessons || st.nodes || []).forEach(les => {
                    const title = les.title || les.name;
                    const key = normalizeStoryKey(title);
                    if (!title || existingKeys.has(key)) return;
                    existingKeys.add(key);
                    pool.push(classifyNodeToStory({
                        topicId: les.id || les.topicId,
                        title: title,
                        subtitle: les.subtitle || les.summary || '',
                        img: les.image || les.img || les.keyArtUrl || 'assets/cards/lumi_rain_coffee_eaves.jpg',
                        scenario: les.scenario || les.description || '',
                        type: les.lessonType === 'story' ? 'book' : 'video'
                    }));
                });
            });
            cachedStoryPool = pool;
        } catch (_) {}
    }

    function setStoryFilter(type, value) {
        if (type === 'genre') activeFilterGenre = value;
        if (type === 'difficulty') activeFilterDifficulty = value;
        renderMysteryGenreCardsList();
    }

    function renderFilterChipsHtml() {
        const diffTabs = Object.values(DIFFICULTY_META).map(d => {
            const active = activeFilterDifficulty === d.id ? 'is-active' : '';
            return `<button type="button" class="story-seg-btn ${active}" onclick="setStoryFilter('difficulty','${d.id}')">${d.label}</button>`;
        }).join('');

        const genreChips = Object.values(GENRE_META).map(g => {
            const active = activeFilterGenre === g.id ? 'is-active' : '';
            return `<button type="button" class="story-genre-pill ${active}" onclick="setStoryFilter('genre','${g.id}')">${g.name}</button>`;
        }).join('');

        return `
            <div class="story-seg-control">${diffTabs}</div>
            <div class="story-genre-row no-scrollbar">${genreChips}</div>
        `;
    }

    function getFilteredStories() {
        const pool = getFullStoryPool();
        return pool.filter(s => {
            const matchG = activeFilterGenre === 'all' || s.genre === activeFilterGenre;
            const matchD = activeFilterDifficulty === 'all' || s.difficulty === activeFilterDifficulty;
            return matchG && matchD;
        });
    }

    function renderMysteryGenreCardsList() {
        const chipsBox = document.getElementById('roadmapStoryFilterChips');
        if (chipsBox) chipsBox.innerHTML = renderFilterChipsHtml();

        const container = document.getElementById('genreCardsListContainer');
        if (!container) return;

        const list = getFilteredStories();
        if (list.length === 0) {
            container.innerHTML = `
                <div class="story-empty-state">
                    <span>Chưa có câu chuyện ở mục này</span>
                    <button type="button" onclick="setStoryFilter('genre','all'); setStoryFilter('difficulty','all');">Xem tất cả</button>
                </div>`;
            return;
        }

        const rowsHtml = list.map(story => {
            const gMeta = GENRE_META[story.genre] || GENRE_META.travel_daily;
            const dMeta = DIFFICULTY_META[story.difficulty] || DIFFICULTY_META.medium;
            const safeId = String(story.id).replace(/'/g, "\\'");
            return `
                <div class="story-track-row" onclick="handlePickStoryById('${safeId}')" role="button" tabindex="0">
                    <img src="${story.img}" alt="${story.title}" class="story-track-art" loading="lazy" />
                    <div class="story-track-info">
                        <h4 class="story-track-title">${story.title}</h4>
                        <div class="story-track-meta">
                            <span class="story-diff-dot ${dMeta.dotCls}"></span>
                            <span class="story-diff-text">${dMeta.short}</span>
                            <span class="story-meta-sep">·</span>
                            <span>${gMeta.name}</span>
                            <span class="story-meta-sep">·</span>
                            <span>${story.duration}</span>
                        </div>
                    </div>
                    <div class="story-track-chevron" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="story-tracklist-card">${rowsHtml}</div>`;
    }

    setTimeout(syncBackendStoryCatalog, 400);

    window.GENRE_META = GENRE_META;
    window.DIFFICULTY_META = DIFFICULTY_META;
    window.resolveRoadmapDifficulty = resolveRoadmapDifficulty;
    window.getRoadmapSlotFlavor = getRoadmapSlotFlavor;
    window.getFullStoryPool = getFullStoryPool;
    window.getFilteredStories = getFilteredStories;
    window.setStoryFilter = setStoryFilter;
    window.renderMysteryGenreCardsList = renderMysteryGenreCardsList;
})(window);
