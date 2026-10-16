// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP — BACKEND STORY CATALOG & FILTER SHEET
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const GENRE_META = {
        all:          { id: 'all',          icon: '✨', name: 'Tất cả' },
        fable:        { id: 'fable',        icon: '🐾', name: 'Ngụ ngôn' },
        travel_daily: { id: 'travel_daily', icon: '✈️', name: 'Du ký' },
        pro_business: { id: 'pro_business', icon: '💼', name: 'Công sở' },
        mystery:      { id: 'mystery',      icon: '🕵️', name: 'Kỳ bí' }
    };

    const DIFFICULTY_META = {
        all:    { id: 'all',    icon: '⚡', label: 'Mọi mức', badgeCls: 'age-badge-10' },
        easy:   { id: 'easy',   icon: '🌱', label: 'Dễ · 3p',  badgeCls: 'age-badge-3' },
        medium: { id: 'medium', icon: '⚡', label: 'Vừa · 5p', badgeCls: 'age-badge-15' },
        hard:   { id: 'hard',   icon: '🔥', label: 'Khó · 7p', badgeCls: 'age-badge-18' }
    };

    const FALLBACK_STORIES = [
        {
            id: 'topic_003',
            title: 'Ngụ ngôn: Rùa và Thỏ',
            subtitle: 'Bài học về sự kiên trì',
            genre: 'fable',
            difficulty: 'easy',
            age: '🌱 Dễ',
            duration: '3 phút',
            img: 'assets/cards/lumi_farmer_strawhat.jpg',
            scenario: 'Cuộc đua vô tiền khoáng hậu giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh tại thung lũng mùa xuân.'
        },
        {
            id: 'topic_006',
            title: 'Ngụ ngôn: Quạ và Bình Nước',
            subtitle: 'Sự thông minh và kiên nhẫn',
            genre: 'fable',
            difficulty: 'easy',
            age: '🌱 Dễ',
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
            age: '🌱 Dễ',
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
            age: '⚡ Vừa',
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
            age: '⚡ Vừa',
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
            age: '⚡ Vừa',
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
            age: '🔥 Khó',
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
            age: '🔥 Khó',
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
            age: '🔥 Khó',
            duration: '7 phút',
            img: 'assets/cards/lumi_farmer_night.png',
            scenario: 'Giải mã những dòng chữ cổ để lại trong căn gác mái đầy bụi thời gian.'
        }
    ];

    let cachedStoryPool = null;
    let activeFilterGenre = 'all';
    let activeFilterDifficulty = 'all';

    function classifyNodeToStory(n) {
        const title = String(n.title || '');
        const rawGenre = (n.tags && n.tags.genre) || '';
        const isFable = title.toLowerCase().includes('ngụ ngôn') || title.toLowerCase().includes('cổ tích') || rawGenre === 'fable' || n.type === 'book';
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
            age: diffMeta.label.split(' · ')[0],
            duration: duration,
            img: n.img || 'assets/cards/lumi_rain_coffee_eaves.jpg',
            scenario: n.scenario || n.purpose || ''
        };
    }

    function getFullStoryPool() {
        if (cachedStoryPool && cachedStoryPool.length > 0) return cachedStoryPool;

        const map = new Map();
        FALLBACK_STORIES.forEach(s => map.set(s.title.toLowerCase(), s));

        const chapters = window.REAL_ROADMAP_CHAPTERS || window.roadmapChaptersData || [];
        chapters.forEach(ch => {
            (ch.nodes || []).forEach(n => {
                if (!n || !n.title || n.type === 'chest' || n.type === 'boss') return;
                const key = n.title.toLowerCase();
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
            const existingTitles = new Set(pool.map(s => s.title.toLowerCase()));

            stages.forEach(st => {
                (st.lessons || st.nodes || []).forEach(les => {
                    const title = les.title || les.name;
                    if (!title || existingTitles.has(String(title).toLowerCase())) return;
                    existingTitles.add(String(title).toLowerCase());
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
        const genreChips = Object.values(GENRE_META).map(g => {
            const active = activeFilterGenre === g.id ? 'is-active' : '';
            return `<button type="button" class="story-filter-chip ${active}" onclick="setStoryFilter('genre','${g.id}')">${g.icon} ${g.name}</button>`;
        }).join('');

        const diffChips = Object.values(DIFFICULTY_META).map(d => {
            const active = activeFilterDifficulty === d.id ? 'is-active' : '';
            return `<button type="button" class="story-filter-chip is-diff ${active}" onclick="setStoryFilter('difficulty','${d.id}')">${d.label}</button>`;
        }).join('');

        return `
            <div class="story-filter-row no-scrollbar">${genreChips}</div>
            <div class="story-filter-row no-scrollbar">${diffChips}</div>
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
                <div class="text-center py-6 text-[12px] text-[var(--rm-on-surface-variant)]">
                    Không có truyện khớp bộ lọc.
                    <button type="button" onclick="setStoryFilter('genre','all'); setStoryFilter('difficulty','all');" class="block mx-auto mt-2 px-3 py-1 rounded-full bg-[var(--rm-primary)] text-[var(--rm-on-primary)] font-bold">Xem tất cả</button>
                </div>`;
            return;
        }

        container.innerHTML = list.map(story => {
            const gMeta = GENRE_META[story.genre] || GENRE_META.travel_daily;
            const dMeta = DIFFICULTY_META[story.difficulty] || DIFFICULTY_META.medium;
            const safeId = String(story.id).replace(/'/g, "\\'");
            return `
                <div class="genre-choice-card" onclick="handlePickStoryById('${safeId}')">
                    <img src="${story.img}" alt="${story.title}" class="story-pick-thumb" loading="lazy" />
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <span class="age-badge ${dMeta.badgeCls}">${story.age}</span>
                            <span class="text-[11px] font-bold text-[var(--rm-on-surface-variant)] truncate">${gMeta.icon} ${gMeta.name} · ${story.duration}</span>
                        </div>
                        <h4 class="text-[14.5px] font-extrabold text-[var(--rm-on-surface)] truncate">${story.title}</h4>
                    </div>
                    <span class="story-pick-go">Chọn</span>
                </div>
            `;
        }).join('');
    }

    setTimeout(syncBackendStoryCatalog, 400);

    window.GENRE_META = GENRE_META;
    window.DIFFICULTY_META = DIFFICULTY_META;
    window.getFullStoryPool = getFullStoryPool;
    window.getFilteredStories = getFilteredStories;
    window.setStoryFilter = setStoryFilter;
    window.renderMysteryGenreCardsList = renderMysteryGenreCardsList;
})(window);
