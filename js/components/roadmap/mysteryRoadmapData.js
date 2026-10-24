// ========================================================
// 🧠 SMART STORY DISCOVERY & SVG CHARACTER TOPIC ENGINE
// Ceiling: < 350 lines | Studio 3/4 Isometric SVG per Topic
// ========================================================

(function (window) {
    'use strict';

    const GENRE_META = {
        all:          { id: 'all',          icon: '✦',  name: 'Tất cả',     charId: 'bea_campfire', role: 'Bạn Đồng Hành Chương', tip: 'Mỗi câu chuyện được minh họa bằng nhân vật SVG 3/4 sống động theo đúng chủ đề bài học!' },
        fable:        { id: 'fable',        icon: '🦊', name: 'Ngụ ngôn',   charId: 'bea_campfire', role: 'Bea · Rừng Ngụ Ngôn',  tip: 'Truyện Ngụ Ngôn ngắn gọn, giàu hình ảnh ẩn dụ giúp bạn nhớ từ vựng sâu gấp 3 lần!' },
        travel_daily: { id: 'travel_daily', icon: '☕', name: 'Đời thường', charId: 'leo_reading',  role: 'Leo · Góc Đời Thường', tip: 'Hội thoại đời sống tự nhiên bên tách cà phê ấm — học xong áp dụng giao tiếp được ngay!' },
        pro_business: { id: 'pro_business', icon: '🎧', name: 'Công sở',    charId: 'miko_lofi',    role: 'Miko · Phòng Thu Pro', tip: 'Tình huống công sở & hậu trường lên sóng kịch tính giúp rèn phản xạ chuyên nghiệp!' },
        mystery:      { id: 'mystery',      icon: '🌙', name: 'Kỳ bí',      charId: 'mia_trophy',   role: 'Mia · Giải Mã Bí Ẩn',  tip: 'Khám phá những mật mã cổ ngữ, chuyến tàu đêm và rương báu vật đầy cuốn hút!' }
    };

    const DIFFICULTY_META = {
        all:    { id: 'all',    label: 'Mọi mức', short: 'Tất cả', dotCls: 'diff-dot-all',  badgeCls: 'age-badge-15' },
        easy:   { id: 'easy',   label: 'Dễ · 3p',  short: 'Dễ',    dotCls: 'diff-dot-easy', badgeCls: 'age-badge-3'  },
        medium: { id: 'medium', label: 'Vừa · 5p', short: 'Vừa',   dotCls: 'diff-dot-med',  badgeCls: 'age-badge-15' },
        hard:   { id: 'hard',   label: 'Khó · 7p', short: 'Khó',   dotCls: 'diff-dot-hard', badgeCls: 'age-badge-18' }
    };

    // Ánh xạ từng chủ đề bài học sang Nhân Vật SVG 3/4 Isometric (character_mindcard) + Bối cảnh màu riêng
    const TOPIC_CHARACTER_PRESETS = {
        topic_003: { charId: 'eddy_sprint',  bg: 'linear-gradient(155deg,#19382C 0%,#2E6347 100%)', p: '#10B981', a: '#FBBF24', tag: 'Đua Bền Bỉ' },
        topic_001: { charId: 'leo_reading',  bg: 'linear-gradient(155deg,#182F42 0%,#29536B 100%)', p: '#0EA5E9', a: '#F59E0B', tag: 'Quán Mưa' },
        topic_004: { charId: 'lily_lantern', bg: 'linear-gradient(155deg,#161B38 0%,#312E68 100%)', p: '#8B5CF6', a: '#38BDF8', tag: 'Tàu Đêm' },
        topic_002: { charId: 'hana_canvas',  bg: 'linear-gradient(155deg,#381E3E 0%,#5E3166 100%)', p: '#EC4899', a: '#F97316', tag: 'Hội Nghị' },
        topic_006: { charId: 'bea_campfire', bg: 'linear-gradient(155deg,#3A2616 0%,#684523 100%)', p: '#F59E0B', a: '#10B981', tag: 'Mưu Trí' },
        topic_007: { charId: 'koji_guitar',  bg: 'linear-gradient(155deg,#381D1A 0%,#633428 100%)', p: '#EA580C', a: '#FBBF24', tag: 'Phố Đêm' },
        topic_008: { charId: 'mia_trophy',   bg: 'linear-gradient(155deg,#251A3A 0%,#49326B 100%)', p: '#A855F7', a: '#FBBF24', tag: 'Rương Cổ' },
        topic_009: { charId: 'vikram_zen',   bg: 'linear-gradient(155deg,#1B2848 0%,#334A7C 100%)', p: '#6366F1', a: '#34D399', tag: 'Lòng Tin' },
        topic_010: { charId: 'miko_lofi',    bg: 'linear-gradient(155deg,#2B163B 0%,#4E2566 100%)', p: '#7C3AED', a: '#EC4899', tag: 'Lên Sóng' },
        topic_005: { charId: 'oscar_gym',    bg: 'linear-gradient(155deg,#3A1F18 0%,#6B3828 100%)', p: '#FF6B4A', a: '#FBBF24', tag: 'Vượt Thác' }
    };

    const STAGE_PALETTES = [
        { charId: 'bea_campfire', bg: 'linear-gradient(155deg,#3A2616 0%,#684523 100%)', p: '#F59E0B', a: '#10B981' },
        { charId: 'leo_reading',  bg: 'linear-gradient(155deg,#182F42 0%,#29536B 100%)', p: '#0EA5E9', a: '#F59E0B' },
        { charId: 'miko_lofi',    bg: 'linear-gradient(155deg,#2B163B 0%,#4E2566 100%)', p: '#7C3AED', a: '#EC4899' },
        { charId: 'oscar_gym',    bg: 'linear-gradient(155deg,#3A1F18 0%,#6B3828 100%)', p: '#FF6B4A', a: '#FBBF24' },
        { charId: 'hana_canvas',  bg: 'linear-gradient(155deg,#381E3E 0%,#5E3166 100%)', p: '#EC4899', a: '#F97316' },
        { charId: 'mia_trophy',   bg: 'linear-gradient(155deg,#251A3A 0%,#49326B 100%)', p: '#10B981', a: '#FBBF24' },
        { charId: 'vikram_zen',   bg: 'linear-gradient(155deg,#1B2848 0%,#334A7C 100%)', p: '#6366F1', a: '#F59E0B' },
        { charId: 'eddy_sprint',  bg: 'linear-gradient(155deg,#19382C 0%,#2E6347 100%)', p: '#EF4444', a: '#FACC15' },
        { charId: 'lily_lantern', bg: 'linear-gradient(155deg,#161B38 0%,#312E68 100%)', p: '#8B5CF6', a: '#38BDF8' },
        { charId: 'koji_guitar',  bg: 'linear-gradient(155deg,#381D1A 0%,#633428 100%)', p: '#3F6212', a: '#EA580C' }
    ];

    const STORY_VOCAB_PREVIEW = {
        topic_001: ['downpour · mưa rào', 'shelter · trú mưa'],
        topic_002: ['badge · thẻ tên', 'keynote · khai mạc'],
        topic_003: ['steady · bền bỉ', 'pace · nhịp độ'],
        topic_004: ['platform · sân ga', 'delayed · trễ tàu'],
        topic_006: ['pebble · viên sỏi', 'clever · mưu trí'],
        topic_007: ['alley · con hẻm', 'broth · nước dùng'],
        topic_008: ['attic · gác mái', 'cipher · mật mã'],
        topic_009: ['shepherd · chăn cừu', 'trust · lòng tin'],
        topic_010: ['broadcast · lên sóng', 'cue · tín hiệu']
    };

    const STORY_HOOK_PREVIEW = {
        topic_001: { en: 'A sudden downpour brought us under the warm café eaves.', vi: '“Cơn mưa rào bất chợt kéo hai người lạ vào chung mái hiên quán nhỏ…”' },
        topic_002: { en: 'Excuse me, I think we accidentally swapped our name badges.', vi: '“Xin lỗi, hình như chúng ta vừa cầm nhầm thẻ tên của nhau…”' },
        topic_003: { en: 'Slow and steady wins the race across the spring valley.', vi: '“Chậm mà chắc mới là người chạm đích cuối cùng giữa thung lũng…”' },
        topic_004: { en: 'The midnight train is delayed on platform three.', vi: '“Chuyến tàu nửa đêm vừa báo hoãn giữa sân ga số 3 mờ sương…”' },
        topic_006: { en: 'One pebble at a time, the water began to rise.', vi: '“Từng viên sỏi nhỏ thả xuống, mực nước trong bình từ từ dâng lên…”' },
        topic_007: { en: 'Follow the warm aroma of ramen down the quiet alley.', vi: '“Đi theo hương nước dùng thơm lừng cuối con hẻm nhỏ lúc lên đèn…”' },
        topic_008: { en: 'Under the moonlight, the ancient wax seal finally cracked.', vi: '“Dưới ánh trăng bạc, dấu niêm phong bằng sáp cổ cuối cùng cũng hé mở…”' },
        topic_009: { en: 'Once trust is broken, even the truth sounds hollow.', vi: '“Khi niềm tin đã vơi, lời nói thật cũng hóa tiếng vọng giữa đồi cỏ…”' },
        topic_010: { en: 'We have ten minutes left before the live broadcast begins.', vi: '“Chỉ còn đúng mười phút cuối trước khi đèn báo lên sóng bật sáng…”' }
    };

    const FALLBACK_STORIES = [
        { id: 'topic_003', title: 'Rùa và Thỏ', subtitle: 'Bài học về sự kiên trì', genre: 'fable', difficulty: 'easy', age: 'Dễ', duration: '3 phút', img: 'assets/cards/calm_story_03_tortoise_hare.jpg', scenario: 'Cuộc đua giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh tại thung lũng mùa xuân.' },
        { id: 'topic_001', title: 'Cơn Mưa Tình Cờ', subtitle: 'Quán cà phê góc phố chiều mưa', genre: 'travel_daily', difficulty: 'medium', age: 'Vừa', duration: '5 phút', img: 'assets/cards/calm_story_01_rain.jpg', scenario: 'Cùng trú mưa dưới mái hiên rạp hát và bắt chuyện tự nhiên với người lạ.' },
        { id: 'topic_004', title: 'Chuyến Tàu Nửa Đêm', subtitle: 'Sân ga mù sương 00:00', genre: 'mystery', difficulty: 'medium', age: 'Vừa', duration: '5 phút', img: 'assets/cards/calm_story_04_train.jpg', scenario: 'Chuyến tàu cuối báo hoãn vô thời hạn giữa sân ga số 3 mờ sương.' },
        { id: 'topic_002', title: 'Chiếc Thẻ Nhầm Tên', subtitle: 'Sảnh hội nghị quốc tế', genre: 'pro_business', difficulty: 'hard', age: 'Khó', duration: '6 phút', img: 'assets/cards/calm_story_02_badge.jpg', scenario: 'Xử lý tình huống cầm nhầm thẻ tên đại biểu lịch thiệp trước giờ khai mạc.' },
        { id: 'topic_006', title: 'Quạ và Bình Nước', subtitle: 'Mưu trí giữa ngày nắng', genre: 'fable', difficulty: 'easy', age: 'Dễ', duration: '3 phút', img: 'assets/cards/lumi_farmer_strawhat.jpg', scenario: 'Chú Quạ khát nước khéo léo thả từng viên sỏi nhỏ để nâng mực nước lên cao.' },
        { id: 'topic_007', title: 'Quán Mì Hẻm Nhỏ', subtitle: 'Ẩm thực đêm & hỏi đường', genre: 'travel_daily', difficulty: 'medium', age: 'Vừa', duration: '5 phút', img: 'assets/cards/lumi_melody_arena.jpg', scenario: 'Gọi món mì đặc sản địa phương và trò chuyện ấm áp cùng đầu bếp bản xứ.' },
        { id: 'topic_009', title: 'Cậu Bé Chăn Cừu', subtitle: 'Giá trị của lòng tin', genre: 'fable', difficulty: 'easy', age: 'Dễ', duration: '4 phút', img: 'assets/cards/pixar_night_farm_scenery.jpg', scenario: 'Những buổi chiều chăn cừu trên đồi cỏ và bài học nhớ đời về sự trung thực.' },
        { id: 'topic_008', title: 'Bức Thư Trong Rương Cổ', subtitle: 'Mật mã dưới ánh trăng', genre: 'mystery', difficulty: 'hard', age: 'Khó', duration: '7 phút', img: 'assets/cards/lumi_train_station_night.jpg', scenario: 'Giải mã phong thư niêm phong sáp cổ để lại trên căn gác mái đầy bụi thời gian.' },
        { id: 'topic_010', title: 'Trước Giờ Lên Sóng', subtitle: 'Hậu trường phát sóng trực tiếp', genre: 'pro_business', difficulty: 'hard', age: 'Khó', duration: '7 phút', img: 'assets/cards/lumi_progress_celebration.jpg', scenario: 'Phối hợp xử lý sự cố âm thanh kịch tính đúng 10 phút trước khi lên sóng.' }
    ];

    let cachedStoryPool = null;
    let activeFilterGenre = 'all';
    let activeFilterDifficulty = 'all';
    let activeSearchQuery = '';

    // Giải quyết Nhân vật SVG 3/4 Isometric chuẩn theo đúng chủ đề của từng câu chuyện / bài học
    function resolveStoryCharacterVisual(story, idxHint = 0) {
        const list = window.ROADMAP_ANIMATED_CHARACTERS || [];
        const id = (story && story.id) || '';
        const text = `${(story && story.title) || ''} ${(story && story.scenario) || ''} ${(story && story.subtitle) || ''}`.toLowerCase();
        let preset = TOPIC_CHARACTER_PRESETS[id];
        if (!preset) {
            if (/rùa|thỏ|đua|chạy|cầu|nhanh|vượt/.test(text)) preset = STAGE_PALETTES[7];
            else if (/mưa|sách|đọc|trà|cà phê|thư viện/.test(text)) preset = STAGE_PALETTES[1];
            else if (/sóng|âm|nhạc|nghe|đài|mic/.test(text)) preset = STAGE_PALETTES[2];
            else if (/thác|đá|núi|nặng|gồng|dũng sĩ/.test(text)) preset = STAGE_PALETTES[3];
            else if (/vẽ|tranh|thẻ|màu|làng|cối xay/.test(text)) preset = STAGE_PALETTES[4];
            else if (/rương|kho báu|bức thư|cúp|vàng/.test(text)) preset = STAGE_PALETTES[5];
            else if (/cừu|thiền|cổ ngữ|lòng tin|tĩnh/.test(text)) preset = STAGE_PALETTES[6];
            else if (/tàu|đêm|sao|đèn|trăng|ước/.test(text)) preset = STAGE_PALETTES[8];
            else if (/mì|hẻm|đàn|quảng trường|du ca/.test(text)) preset = STAGE_PALETTES[9];
            else preset = STAGE_PALETTES[Math.abs(idxHint) % STAGE_PALETTES.length];
        }
        const charObj = list.find(c => c.id === preset.charId) || list[0] || { svg: '' };
        return {
            charId: preset.charId, charName: charObj.name || 'Nhân vật MindCard', badge: preset.tag || 'Chọn ✦',
            svg: charObj.svg || '', bg: preset.bg, primary: preset.p, accent: preset.a,
            styleVars: `background:${preset.bg}; --rm-char-primary:${preset.p}; --rm-char-accent:${preset.a};`
        };
    }

    function resolveRoadmapDifficulty(node, story) {
        const raw = String((story && (story.difficulty || story.age)) || (node && (node.level || (node.tags && node.tags.age))) || '').toLowerCase();
        if (raw.includes('easy') || raw.includes('dễ') || raw === '3+' || raw === '10+' || (node && node.type === 'book')) return DIFFICULTY_META.easy;
        if (raw.includes('hard') || raw.includes('khó') || raw === '18+') return DIFFICULTY_META.hard;
        return DIFFICULTY_META.medium;
    }

    const getRoadmapSlotFlavor = (nodeNum) => ({ icon: '✦', diffShort: nodeNum <= 3 ? 'Dễ' : (nodeNum >= 8 ? 'Khó' : 'Vừa'), badgeCls: 'age-badge-15', themeTag: 'Tự chọn' });
    const getStoryVocabChips = (story, node) => STORY_VOCAB_PREVIEW[(story && story.id) || (node && node.topicId) || 'topic_003'] || ['context · ngữ cảnh', 'fluency · phản xạ'];
    function getStoryHookData(story, node) {
        const id = (story && story.id) || (node && node.topicId) || 'topic_003';
        if (STORY_HOOK_PREVIEW[id]) return STORY_HOOK_PREVIEW[id];
        const fallbackVi = (story && story.scenario) || (node && node.scenario) || 'Khám phá tình huống giao tiếp tự nhiên qua câu chuyện.';
        return { en: 'Listen closely to how native speakers handle this moment.', vi: `“${fallbackVi}”` };
    }

    const cleanStoryTitle = (raw) => String(raw || '').replace(/^(ngụ ngôn|cổ tích|hội thoại|truyện)\s*:\s*/i, '').trim();
    const normalizeStoryKey = (title) => cleanStoryTitle(title).toLowerCase();

    function classifyNodeToStory(n, idxHint = 0) {
        const rawTitle = String(n.title || n.topic || ''), title = cleanStoryTitle(rawTitle), rawGenre = (n.tags && n.tags.genre) || n.genre || '';
        const isFable = rawTitle.toLowerCase().includes('ngụ ngôn') || rawGenre === 'fable' || n.type === 'book' || n.lessonType === 'story';
        const isWork = rawGenre === 'dialogue_work' || title.includes('Hội Nghị') || title.includes('Sóng') || title.includes('Thẻ');
        const isMystery = title.includes('Bí Ẩn') || title.includes('Đêm') || title.includes('Lạc') || title.includes('Rương');
        const genre = isFable ? 'fable' : (isWork ? 'pro_business' : (isMystery ? 'mystery' : 'travel_daily'));
        const difficulty = (n.level === 'easy' || n.level === 'hard' || n.level === 'medium') ? n.level : (genre === 'fable' ? 'easy' : (genre === 'pro_business' || genre === 'mystery' ? 'hard' : 'medium'));
        const diffMeta = DIFFICULTY_META[difficulty] || DIFFICULTY_META.medium;
        return {
            id: n.topicId || n.id || `node_${Number(n.day || n.num || idxHint) || 0}`, title, subtitle: n.subtitle || n.purpose || '',
            genre, difficulty, age: diffMeta.short, duration: difficulty === 'easy' ? '3 phút' : (difficulty === 'hard' ? '7 phút' : '5 phút'),
            img: n.img || 'assets/cards/calm_story_01_rain.jpg', scenario: n.scenario || n.subtitle || n.purpose || 'Tình huống giao tiếp thực tế giàu cảm xúc.'
        };
    }

    function getFullStoryPool() {
        if (cachedStoryPool && cachedStoryPool.length > 0) return cachedStoryPool;
        const map = new Map();
        FALLBACK_STORIES.forEach(s => map.set(normalizeStoryKey(s.title), s));
        let counter = 0;
        (window.roadmapChaptersData || window.REAL_ROADMAP_CHAPTERS || []).forEach(ch => (ch.nodes || []).forEach(n => {
            if (!n || !n.title || n.type === 'chest' || n.type === 'boss') return;
            const key = normalizeStoryKey(n.title);
            if (!map.has(key)) map.set(key, classifyNodeToStory(n, ++counter));
        }));
        return (cachedStoryPool = Array.from(map.values()));
    }

    async function syncBackendStoryCatalog() {
        if (typeof fetch !== 'function') return;
        try {
            const resp = await fetch(`${window.API_BASE_URL || 'https://mindcards-lessons.mindcards.workers.dev'}/api/v1/lessons/roadmap?displayLanguage=vi&contentLanguage=en`);
            if (!resp.ok) return;
            const data = await resp.json(), stages = data.stages || (data.data && data.data.stages) || [];
            if (!Array.isArray(stages) || !stages.length) return;
            const pool = getFullStoryPool(), existingKeys = new Set(pool.map(s => normalizeStoryKey(s.title)));
            let idx = pool.length;
            stages.forEach(st => (st.topics || st.lessons || st.nodes || []).forEach(les => {
                const title = les.topic || les.title || les.name, key = normalizeStoryKey(title);
                if (!title || existingKeys.has(key)) return;
                existingKeys.add(key);
                pool.push(classifyNodeToStory({
                    topicId: les.topicId || les.topic_id || les.id, day: les.day, title, subtitle: les.purpose || les.subtitle || '',
                    img: les.backgroundImageUrl || les.background_image_url || '', scenario: les.scenario || les.purpose || '',
                    lessonType: les.lesson_type || les.lessonType, level: les.level
                }, ++idx));
            }));
            cachedStoryPool = pool;
        } catch (_) {}
    }

    function setStoryFilter(type, value) {
        if (type === 'genre') activeFilterGenre = value;
        if (type === 'difficulty') activeFilterDifficulty = value;
        renderMysteryGenreCardsList(false);
    }
    function setStorySearchQuery(val) {
        activeSearchQuery = String(val || '').trim();
        renderMysteryGenreCardsList(true);
    }
    function getFilteredStories() {
        const pool = getFullStoryPool(), q = activeSearchQuery.toLowerCase();
        return pool.filter(s => (activeFilterGenre === 'all' || s.genre === activeFilterGenre)
            && (activeFilterDifficulty === 'all' || s.difficulty === activeFilterDifficulty)
            && (!q || s.title.toLowerCase().includes(q) || (s.scenario && s.scenario.toLowerCase().includes(q)) || (s.subtitle && s.subtitle.toLowerCase().includes(q))));
    }

    function renderFilterChipsHtml() {
        const pool = getFullStoryPool();
        const diffTabs = Object.values(DIFFICULTY_META).map(d => {
            const active = activeFilterDifficulty === d.id ? 'is-active' : '';
            const dot = d.id !== 'all' ? `<i class="story-seg-dot ${d.dotCls}"></i>` : '';
            return `<button type="button" class="story-seg-btn ${active}" onclick="setStoryFilter('difficulty','${d.id}')">${dot}<span>${d.label}</span></button>`;
        }).join('');
        const genreChips = Object.values(GENRE_META).map(g => {
            const active = activeFilterGenre === g.id ? 'is-active' : '';
            const cnt = pool.filter(s => (g.id === 'all' || s.genre === g.id) && (activeFilterDifficulty === 'all' || s.difficulty === activeFilterDifficulty)).length;
            return `<button type="button" class="story-genre-pill ${active}" onclick="setStoryFilter('genre','${g.id}')"><span>${g.icon} ${g.name}</span><b class="story-pill-count">${cnt}</b></button>`;
        }).join('');
        const clearBtn = activeSearchQuery
            ? `<button type="button" class="story-search-clear" onclick="setStorySearchQuery('')" aria-label="Xóa tìm kiếm">✕</button>` : '';
        return `
            <div class="story-search-box">
                <svg class="story-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input id="storySheetSearchInput" type="text" class="story-search-input" placeholder="Tìm tên truyện, chủ đề (mưa, sân ga, rùa...)" value="${activeSearchQuery.replace(/"/g, '&quot;')}" oninput="setStorySearchQuery(this.value)" />
                ${clearBtn}
            </div>
            <div class="story-seg-control">${diffTabs}</div>
            <div class="story-genre-row no-scrollbar">${genreChips}</div>`;
    }

    function pickSmartSpotlightTrio(list, nodeNum) {
        if (list.length < 4) return [];
        const easy = list.filter(s => s.difficulty === 'easy');
        const med = list.filter(s => s.difficulty === 'medium');
        const hard = list.filter(s => s.difficulty === 'hard');
        const pick = (arr, fb) => arr.length ? arr[(nodeNum - 1) % arr.length] : fb;
        const trio = [pick(med, list[0]), pick(easy, list[1]), pick(hard, list[2])].filter(Boolean);
        return Array.from(new Map(trio.map(s => [s.id, s])).values()).slice(0, 3);
    }

    function renderMysteryGenreCardsList(keepSearchFocus = false) {
        const slot = (typeof window.getCurrentPickingSlot === 'function') ? window.getCurrentPickingSlot() : { chapterId: 0, nodeNum: 3 };
        const ch = (window.roadmapChaptersData && window.roadmapChaptersData[slot.chapterId || 0]) || null;
        const badge = document.getElementById('pickerSheetNodeBadge');
        if (badge) badge.innerHTML = `✦ CHẶNG ${slot.nodeNum || 3} ${ch ? `· ${ch.title.toUpperCase()}` : ''}`;

        const chipsBox = document.getElementById('roadmapStoryFilterChips');
        if (chipsBox && !keepSearchFocus) chipsBox.innerHTML = renderFilterChipsHtml();

        const container = document.getElementById('genreCardsListContainer');
        if (!container) return;

        const list = getFilteredStories();
        if (list.length === 0) {
            container.innerHTML = `<div class="story-empty-state"><div class="story-empty-icon">🔍</div><strong>Không tìm thấy câu chuyện phù hợp</strong><span>Hãy thử từ khóa khác hoặc đặt lại bộ lọc.</span><button type="button" class="story-empty-reset-btn" onclick="setStorySearchQuery(''); setStoryFilter('genre','all'); setStoryFilter('difficulty','all');">Xem toàn bộ kho truyện</button></div>`;
            return;
        }

        // Banner Nhân vật SVG 3/4 dẫn chuyện theo đúng Chủ đề / Thể loại đang chọn
        const activeGMeta = GENRE_META[activeFilterGenre] || GENRE_META.all;
        const hostChar = (activeFilterGenre === 'all' && typeof window.getRoadmapAnimatedCharacter === 'function')
            ? window.getRoadmapAnimatedCharacter(slot.chapterId || 0, ((slot.nodeNum || 1) > 5 ? 1 : 0))
            : (window.ROADMAP_ANIMATED_CHARACTERS || []).find(c => c.id === activeGMeta.charId) || (window.ROADMAP_ANIMATED_CHARACTERS || [])[0];
        const hostBannerHtml = hostChar ? `
            <div class="story-theme-host-banner" style="--rm-char-primary:${hostChar.primaryColor || '#10B981'}; --rm-char-accent:${hostChar.accentColor || '#F59E0B'};">
                <div class="story-theme-host-stage">${hostChar.svg}</div>
                <div class="story-theme-host-copy">
                    <span class="story-theme-host-badge">✦ ${activeFilterGenre === 'all' ? (hostChar.name || activeGMeta.role) : activeGMeta.role}</span>
                    <p class="story-theme-host-tip">${activeFilterGenre === 'all' ? hostChar.quote : activeGMeta.tip}</p>
                </div>
            </div>` : '';

        const showSpotlight = (activeFilterGenre === 'all' && activeFilterDifficulty === 'all' && !activeSearchQuery);
        const spotlightTrio = showSpotlight ? pickSmartSpotlightTrio(list, slot.nodeNum || 3) : [];
        const spotlightIds = new Set(spotlightTrio.map(s => s.id));
        const matchBadges = ['🔥 Hợp 98%', '🌿 Thư giãn', '⚡ Phản xạ'];

        const shelfHtml = spotlightTrio.length ? `
            <div class="story-shelf-wrap">
                <div class="story-shelf-head">
                    <span class="story-shelf-label">✦ Đề xuất thông minh cho Chặng ${slot.nodeNum || 3}</span>
                    <span class="story-shelf-sub">Nhân vật SVG 3 Hồi ›</span>
                </div>
                <div class="story-snap-lane no-scrollbar">
                    ${spotlightTrio.map((st, idx) => {
                        const dMeta = DIFFICULTY_META[st.difficulty] || DIFFICULTY_META.medium;
                        const safeId = String(st.id).replace(/'/g, "\\'");
                        const hook = getStoryHookData(st);
                        const encEn = encodeURIComponent(hook.en);
                        const vis = resolveStoryCharacterVisual(st, idx);
                        return `
                            <div class="story-snap-album" style="--card-i:${idx}" onclick="handlePickStoryById('${safeId}')" role="button" tabindex="0">
                                <div class="story-snap-cover is-svg-diorama" style="${vis.styleVars}">
                                    <div class="story-snap-svg-rig" aria-hidden="true">${vis.svg}</div>
                                    <span class="story-snap-match-pill">${matchBadges[idx] || '✦ Gợi ý'}</span>
                                    <button type="button" class="story-snap-audio-btn" onclick="event.stopPropagation(); playStoryHookAudio('${encEn}', this)" title="Nghe thử câu mở đầu">🔊</button>
                                </div>
                                <span class="story-snap-title">${st.title}</span>
                                <span class="story-snap-sub"><i class="story-diff-dot ${dMeta.dotCls}"></i>${dMeta.short} · ${st.duration}</span>
                            </div>`;
                    }).join('')}
                </div>
            </div>` : '';

        const sortedList = showSpotlight
            ? [...list.filter(s => !spotlightIds.has(s.id)), ...list.filter(s => spotlightIds.has(s.id))]
            : list;

        const rowsHtml = sortedList.map((story, rIdx) => {
            const gMeta = GENRE_META[story.genre] || GENRE_META.travel_daily;
            const dMeta = DIFFICULTY_META[story.difficulty] || DIFFICULTY_META.medium;
            const safeId = String(story.id).replace(/'/g, "\\'");
            const vocabs = getStoryVocabChips(story);
            const hook = getStoryHookData(story);
            const encEn = encodeURIComponent(hook.en);
            const vis = resolveStoryCharacterVisual(story, rIdx + 3);
            return `
                <div class="story-track-row" style="--row-i:${Math.min(rIdx, 10)}" onclick="handlePickStoryById('${safeId}')" role="button" tabindex="0">
                    <div class="story-track-art-wrap is-svg-thumb" style="${vis.styleVars}">
                        <div class="story-track-svg-rig" aria-hidden="true">${vis.svg}</div>
                        <span class="story-track-diff-pill ${dMeta.dotCls}">${dMeta.short}</span>
                    </div>
                    <div class="story-track-info">
                        <div class="story-track-title-line">
                            <h4 class="story-track-title">${story.title}</h4>
                            <span class="story-track-dur">${story.duration}</span>
                        </div>
                        <p class="story-track-scenario">${story.scenario || story.subtitle}</p>
                        <div class="story-track-meta">
                            <span>${gMeta.icon} ${gMeta.name}</span>
                            <span class="story-meta-sep">•</span>
                            <span class="story-track-vocab-tag">${vocabs[0]}</span>
                        </div>
                    </div>
                    <div class="story-track-actions">
                        <button type="button" class="story-row-audio-btn" onclick="event.stopPropagation(); playStoryHookAudio('${encEn}', this)" title="Nghe thử giọng đọc" aria-label="Nghe thử">🔊</button>
                        <span class="story-row-pick-pill">Chọn ›</span>
                    </div>
                </div>`;
        }).join('');

        container.innerHTML = `${hostBannerHtml}${shelfHtml}<div class="story-shelf-head is-list-head"><span class="story-shelf-label">Kho câu chuyện (${list.length})</span><span class="story-shelf-sub">+20% Lumi / bài</span></div><div class="story-tracklist-card">${rowsHtml}</div>`;
    }

    setTimeout(syncBackendStoryCatalog, 350);

    Object.assign(window, {
        GENRE_META, DIFFICULTY_META, resolveRoadmapDifficulty, getRoadmapSlotFlavor,
        getStoryVocabChips, getStoryHookData, resolveStoryCharacterVisual,
        getFullStoryPool, getFilteredStories, setStoryFilter, setStorySearchQuery, renderMysteryGenreCardsList
    });
})(window);
