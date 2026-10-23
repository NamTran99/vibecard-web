/**
 * ==========================================================================
 * PROFILE SCREEN & DEDICATED SETTINGS PAGE CONTROLLER — HUMAN-CRAFTED UI
 * Colored Dual-Tone Vector Icons, 1:1 Onboarding Language/Level/Goal Lists,
 * Independent Expandable Dropdowns, High-Contrast AAA Tokens.
 * ==========================================================================
 */

(function (window) {
    'use strict';

    // Exact Crisp SVG Flags from Onboarding Flow (VcFlags)
    const ONBOARDING_FLAGS = {
        EN: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#012169"/><path d="M0 0L28 20M28 0L0 20" stroke="#FFF" stroke-width="3.2"/><path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" stroke-width="1.6"/><path d="M14 0V20M0 10H28" stroke="#FFF" stroke-width="5.2"/><path d="M14 0V20M0 10H28" stroke="#C8102E" stroke-width="3"/></svg>`,
        JA: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#FFFFFF"/><circle cx="14" cy="10" r="5.6" fill="#BC002D"/></svg>`,
        KO: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#FFFFFF"/><circle cx="14" cy="10" r="5" fill="#CD2E3A"/><path d="M9 10a5 5 0 0 0 10 0 2.5 2.5 0 0 0-5 0 2.5 2.5 0 0 1-5 0z" fill="#0047A0"/><g stroke="#111" stroke-width="1.1"><line x1="6" y1="4.5" x2="8.5" y2="7"/><line x1="22" y1="4.5" x2="19.5" y2="7"/><line x1="6" y1="15.5" x2="8.5" y2="13"/><line x1="22" y1="15.5" x2="19.5" y2="13"/></g></svg>`,
        ZH: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#DE2910"/><polygon points="6,3.2 6.9,5.8 9.6,5.8 7.4,7.4 8.2,10 6,8.4 3.8,10 4.6,7.4 2.4,5.8 5.1,5.8" fill="#FFDE00"/><circle cx="11.5" cy="3.2" r="0.9" fill="#FFDE00"/><circle cx="13.2" cy="5.2" r="0.9" fill="#FFDE00"/><circle cx="13.2" cy="7.8" r="0.9" fill="#FFDE00"/><circle cx="11.5" cy="9.8" r="0.9" fill="#FFDE00"/></svg>`,
        FR: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="9.33" height="20" fill="#002395"/><rect x="9.33" width="9.34" height="20" fill="#FFFFFF"/><rect x="18.67" width="9.33" height="20" fill="#ED2939"/></svg>`,
        ES: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#AA151B"/><rect y="5" width="28" height="10" fill="#F1BF00"/></svg>`,
        DE: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="6.67" fill="#111111"/><rect y="6.67" width="28" height="6.67" fill="#DD0000"/><rect y="13.33" width="28" height="6.67" fill="#FFCE00"/></svg>`,
        AU: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#00008B"/><rect width="14" height="10" fill="#012169"/><path d="M0 0L14 10M14 0L0 10" stroke="#FFF" stroke-width="2"/><path d="M7 0V10M0 5H14" stroke="#FFF" stroke-width="3"/><path d="M7 0V10M0 5H14" stroke="#C8102E" stroke-width="1.6"/><circle cx="7" cy="15" r="2.2" fill="#FFF"/><circle cx="21" cy="5" r="1.3" fill="#FFF"/><circle cx="24" cy="9" r="1.3" fill="#FFF"/><circle cx="21" cy="15" r="1.5" fill="#FFF"/><circle cx="17.5" cy="10" r="1.3" fill="#FFF"/></svg>`,
        US: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,0.14);"><rect width="28" height="20" fill="#B22234"/><rect y="3" width="28" height="2.5" fill="#FFF"/><rect y="8" width="28" height="2.5" fill="#FFF"/><rect y="13" width="28" height="2.5" fill="#FFF"/><rect y="18" width="28" height="2" fill="#FFF"/><rect width="12" height="10.5" fill="#3C3B6E"/><circle cx="3" cy="3" r="0.9" fill="#FFF"/><circle cx="6" cy="3" r="0.9" fill="#FFF"/><circle cx="9" cy="3" r="0.9" fill="#FFF"/><circle cx="4.5" cy="5.5" r="0.9" fill="#FFF"/><circle cx="7.5" cy="5.5" r="0.9" fill="#FFF"/><circle cx="3" cy="8" r="0.9" fill="#FFF"/><circle cx="6" cy="8" r="0.9" fill="#FFF"/><circle cx="9" cy="8" r="0.9" fill="#FFF"/></svg>`
    };

    const ONBOARDING_LANGUAGES = [
        { code: 'EN', name: 'Tiếng Anh', flagEmoji: '🇬🇧', learners: '148.2K người học' },
        { code: 'JA', name: 'Tiếng Nhật', flagEmoji: '🇯🇵', learners: '64.5K người học' },
        { code: 'KO', name: 'Tiếng Hàn', flagEmoji: '🇰🇷', learners: '52.1K người học' },
        { code: 'ZH', name: 'Tiếng Trung', flagEmoji: '🇨🇳', learners: '41.8K người học' },
        { code: 'FR', name: 'Tiếng Pháp', flagEmoji: '🇫🇷', learners: '19.4K người học' },
        { code: 'ES', name: 'Tiếng Tây Ban Nha', flagEmoji: '🇪🇸', learners: '16.2K người học' },
        { code: 'DE', name: 'Tiếng Đức', flagEmoji: '🇩🇪', learners: '12.9K người học' }
    ];

    const PROFICIENCY_LEVELS = [
        { id: 'lv1', bars: 1, shortTag: 'Mới bắt đầu', desc: 'Làm quen từ vựng cơ bản' },
        { id: 'lv2', bars: 2, shortTag: 'Biết từ cơ bản', desc: 'Biết từ & câu thông dụng' },
        { id: 'lv3', bars: 3, shortTag: 'Giao tiếp cơ bản', desc: 'Giao tiếp các câu ngắn' },
        { id: 'lv4', bars: 4, shortTag: 'Đa dạng chủ đề', desc: 'Hiểu nhiều chủ đề khác nhau' },
        { id: 'lv5', bars: 5, shortTag: 'Hiểu sâu chi tiết', desc: 'Đọc hiểu sâu các chủ đề' }
    ];

    const DAILY_GOALS = [
        { minutes: 5, words: 5, label: '5 phút / ngày', wordsLabel: '5 từ / ngày', tag: 'Nhẹ nhàng', desc: 'Nhẹ nhàng · 1 cảnh ngắn/ngày' },
        { minutes: 10, words: 15, label: '10 phút / ngày', wordsLabel: '15 từ / ngày', tag: 'Đều đặn', desc: 'Đều đặn · 1 chương truyện/ngày' },
        { minutes: 15, words: 30, label: '15 phút / ngày', wordsLabel: '30 từ / ngày', tag: 'Tăng tốc', desc: 'Tăng tốc · 2 chương truyện/ngày' },
        { minutes: 20, words: 50, label: '20 phút / ngày', wordsLabel: '50 từ / ngày', tag: 'Chuyên sâu', desc: 'Chuyên sâu · 3 chương truyện/ngày' }
    ];

    const THEME_MODES = [
        {
            mode: 'dark',
            badge: 'Tối',
            title: 'Giao diện Tối',
            desc: 'Bảo vệ mắt ban đêm · Tương phản AAA',
            accentColor: '#38BDF8',
            accentBg: 'rgba(56, 189, 248, 0.16)',
            iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="rgba(56, 189, 248, 0.25)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        },
        {
            mode: 'light',
            badge: 'Sáng',
            title: 'Giao diện Sáng',
            desc: 'Nền giấy ấm áp · Đọc truyện ban ngày',
            accentColor: '#F59E0B',
            accentBg: 'rgba(245, 158, 11, 0.16)',
            iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="rgba(245, 158, 11, 0.25)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        },
        {
            mode: 'system',
            badge: 'Hệ thống',
            title: 'Tự động theo thiết bị',
            desc: 'Tự động chuyển Sáng / Tối theo máy',
            accentColor: '#A3E635',
            accentBg: 'rgba(163, 230, 53, 0.16)',
            iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="rgba(163, 230, 53, 0.2)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
        }
    ];

    // 1:1 Onboarding 5-Bar Proficiency Signal Graphic
    function renderOnboardingSignalBars(activeBars = 4, totalBars = 5) {
        const heights = [7, 11, 15, 19, 23];
        const barsSvg = heights.slice(0, totalBars).map((h, i) => {
            const x = 2 + i * 6;
            const y = 25 - h;
            const isActive = i < activeBars;
            const fill = isActive ? '#A3E635' : 'rgba(191, 195, 176, 0.28)';
            return `<rect x="${x}" y="${y}" width="4.2" height="${h}" rx="2.1" fill="${fill}" />`;
        }).join('');
        return `<svg width="32" height="26" viewBox="0 0 32 26" aria-hidden="true">${barsSvg}</svg>`;
    }

    // 1:1 Onboarding Progressive Clock Icon (5m, 10m, 15m, 20m)
    function renderOnboardingClockIcon(minutes = 10) {
        let sectorSvg = '';
        let arcSvg = '';
        let handX = 19.5;
        let handY = 15;
        const strokeColor = minutes <= 5 ? '#38BDF8' : (minutes <= 10 ? '#A3E635' : (minutes <= 15 ? '#FBBF24' : '#FB923C'));
        const fillTint = minutes <= 5 ? 'rgba(56, 189, 248, 0.25)' : (minutes <= 10 ? 'rgba(163, 230, 53, 0.25)' : (minutes <= 15 ? 'rgba(251, 191, 36, 0.25)' : 'rgba(251, 146, 60, 0.28)'));

        if (minutes <= 5) {
            sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 0 1 21.8 15 Z" fill="${fillTint}" />`;
            arcSvg = `<path d="M14 5 A10 10 0 0 1 24 15" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" />`;
            handX = 19.2; handY = 15;
        } else if (minutes <= 10) {
            sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 0 1 14 22.8 Z" fill="${fillTint}" />`;
            arcSvg = `<path d="M14 5 A10 10 0 0 1 14 25" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" />`;
            handX = 14; handY = 20.2;
        } else if (minutes <= 15) {
            sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 1 1 6.2 15 Z" fill="${fillTint}" />`;
            arcSvg = `<path d="M14 5 A10 10 0 1 1 4 15" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" />`;
            handX = 8.8; handY = 15;
        } else {
            sectorSvg = `<circle cx="14" cy="15" r="7.8" fill="${fillTint}" />`;
            arcSvg = `<circle cx="14" cy="15" r="10" fill="none" stroke="${strokeColor}" stroke-width="2.2" />`;
            handX = 18.5; handY = 11.5;
        }

        return `
            <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M11 2h6M14 2v2.4M20.8 5.8l1.5-1.5" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
                <circle cx="14" cy="15" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.22" />
                ${sectorSvg}
                ${arcSvg}
                <line x1="14" y1="15" x2="14" y2="9.4" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
                <line x1="14" y1="15" x2="${handX}" y2="${handY}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
                <circle cx="14" cy="15" r="1.8" fill="${strokeColor}" />
            </svg>`;
    }

    // Dual-Tone Colored Vector SVGs for Badges (Every badge has rich inner tint + crisp colored stroke)
    const BADGE_SVGS = {
        flame: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
        layers: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        book: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
        zap: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        award: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
        shield: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
        mic: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
        moon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
        grid: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>`,
        compass: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
        crown: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
        target: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
    };

    // All 12 Badges now feature bespoke semantic colors (both owned and unowned)
    const ALL_BADGES_CATALOG = [
        {
            id: 'streak_7',
            title: 'Giữ Lửa 7 Ngày',
            desc: 'Duy trì chuỗi học tập 7 ngày liên tiếp không ngắt quãng.',
            svgKey: 'flame',
            accentColor: '#FB923C',
            accentBg: 'rgba(251, 146, 60, 0.18)',
            accentBorder: 'rgba(251, 146, 60, 0.42)',
            unlocked: true,
            progressText: '7 / 7 ngày',
            progressPct: 100
        },
        {
            id: 'vocab_100',
            title: '100+ Từ Vựng',
            desc: 'Thu thập và lưu hơn 100 thẻ từ vựng vào thư viện cá nhân.',
            svgKey: 'layers',
            accentColor: '#A3E635',
            accentBg: 'rgba(163, 230, 53, 0.18)',
            accentBorder: 'rgba(163, 230, 53, 0.42)',
            unlocked: true,
            progressText: '123 / 100 từ',
            progressPct: 100
        },
        {
            id: 'lumi_friend',
            title: 'Bạn Thân Cáo Lumi',
            desc: 'Hoàn thành 5 chương truyện tương tác cùng Cáo Lumi.',
            svgKey: 'book',
            accentColor: '#2DD4BF',
            accentBg: 'rgba(45, 212, 191, 0.18)',
            accentBorder: 'rgba(45, 212, 191, 0.42)',
            unlocked: true,
            progressText: '5 / 5 truyện',
            progressPct: 100
        },
        {
            id: 'xp_1000',
            title: 'Tân Binh Tinh Anh',
            desc: 'Đạt mốc 1,000 điểm kinh nghiệm (XP) đầu tiên.',
            svgKey: 'zap',
            accentColor: '#FBBF24',
            accentBg: 'rgba(251, 191, 36, 0.18)',
            accentBorder: 'rgba(251, 191, 36, 0.42)',
            unlocked: true,
            progressText: '1,450 / 1,000 XP',
            progressPct: 100
        },
        {
            id: 'master_500',
            title: 'Bậc Thầy Cấp 4',
            desc: 'Đưa 500 từ vựng lên Cấp độ 4 (Thông thạo dài hạn trong SRS).',
            svgKey: 'award',
            accentColor: '#FB7185',
            accentBg: 'rgba(251, 113, 133, 0.15)',
            accentBorder: 'rgba(251, 113, 133, 0.35)',
            unlocked: false,
            progressText: '123 / 500 từ',
            progressPct: 25
        },
        {
            id: 'streak_30',
            title: 'Chiến Binh 30 Ngày',
            desc: 'Giữ chuỗi Streak học tập suốt 30 ngày liên tục.',
            svgKey: 'shield',
            accentColor: '#38BDF8',
            accentBg: 'rgba(56, 189, 248, 0.15)',
            accentBorder: 'rgba(56, 189, 248, 0.35)',
            unlocked: false,
            progressText: '7 / 30 ngày',
            progressPct: 23
        },
        {
            id: 'pronounce_50',
            title: 'Phát Âm Bản Xứ',
            desc: 'Đạt điểm phát âm 95%+ cho 50 từ vựng liên tiếp.',
            svgKey: 'mic',
            accentColor: '#34D399',
            accentBg: 'rgba(52, 211, 153, 0.15)',
            accentBorder: 'rgba(52, 211, 153, 0.35)',
            unlocked: false,
            progressText: '18 / 50 từ',
            progressPct: 36
        },
        {
            id: 'night_owl',
            title: 'Học Giả Rừng Đêm',
            desc: 'Hoàn thành 20 phiên ôn tập thẻ sau 22:00 tối.',
            svgKey: 'moon',
            accentColor: '#F59E0B',
            accentBg: 'rgba(245, 158, 11, 0.15)',
            accentBorder: 'rgba(245, 158, 11, 0.35)',
            unlocked: false,
            progressText: '9 / 20 phiên',
            progressPct: 45
        },
        {
            id: 'deck_creator',
            title: 'Kiến Trúc Sư Bộ Thẻ',
            desc: 'Tự tạo 15 bộ thẻ từ vựng bằng AI, OCR hoặc Audio.',
            svgKey: 'grid',
            accentColor: '#22D3EE',
            accentBg: 'rgba(34, 211, 238, 0.15)',
            accentBorder: 'rgba(34, 211, 238, 0.35)',
            unlocked: false,
            progressText: '8 / 15 bộ thẻ',
            progressPct: 53
        },
        {
            id: 'story_explorer',
            title: 'Thám Hiểm Ngôn Từ',
            desc: 'Mở khóa và hoàn thành toàn bộ 4 chương Lộ trình Truyện.',
            svgKey: 'compass',
            accentColor: '#F97316',
            accentBg: 'rgba(249, 115, 22, 0.15)',
            accentBorder: 'rgba(249, 115, 22, 0.35)',
            unlocked: false,
            progressText: '1 / 4 chương',
            progressPct: 25
        },
        {
            id: 'xp_5000',
            title: 'Huyền Thoại Lumi',
            desc: 'Tích lũy tổng cộng 5,000 điểm XP học tập.',
            svgKey: 'crown',
            accentColor: '#EAB308',
            accentBg: 'rgba(234, 179, 8, 0.16)',
            accentBorder: 'rgba(234, 179, 8, 0.38)',
            unlocked: false,
            progressText: '1,450 / 5,000 XP',
            progressPct: 29
        },
        {
            id: 'streak_100',
            title: 'Ngọn Lửa Bất Diệt',
            desc: 'Cột mốc danh giá: 100 ngày học liên tiếp không gián đoạn.',
            svgKey: 'target',
            accentColor: '#F43F5E',
            accentBg: 'rgba(244, 63, 94, 0.15)',
            accentBorder: 'rgba(244, 63, 94, 0.35)',
            unlocked: false,
            progressText: '7 / 100 ngày',
            progressPct: 7
        }
    ];

    let activeProfileSubTab = 'overview'; // 'overview' | 'badges'
    let activeBadgeFilter = 'all'; // 'all' | 'owned' | 'locked'
    let activeTargetLangCode = null;

    function getSavedTargetLangCode() {
        if (activeTargetLangCode && ONBOARDING_LANGUAGES.some(l => l.code === activeTargetLangCode)) {
            return activeTargetLangCode;
        }
        try {
            const fromStorage = localStorage.getItem('mindcard-target-lang');
            if (fromStorage && ONBOARDING_LANGUAGES.some(l => l.code === fromStorage)) {
                activeTargetLangCode = fromStorage;
                return fromStorage;
            }
            const fromStore = window.AppStore && window.AppStore.getState('targetLang');
            if (fromStore && ONBOARDING_LANGUAGES.some(l => l.code === fromStore)) {
                activeTargetLangCode = fromStore;
                return fromStore;
            }
        } catch (e) {}
        return 'EN';
    }

    function getSavedLevelIdx() {
        try {
            const raw = localStorage.getItem('mindcard-proficiency-level-idx');
            const idx = parseInt(raw, 10);
            if (!isNaN(idx) && idx >= 0 && idx < PROFICIENCY_LEVELS.length) return idx;
        } catch (e) {}
        return 3; // Default B2 (idx 3)
    }

    function getSavedDailyGoalIdx() {
        try {
            const raw = localStorage.getItem('mindcard-daily-goal-idx');
            const idx = parseInt(raw, 10);
            if (!isNaN(idx) && idx >= 0 && idx < DAILY_GOALS.length) return idx;
        } catch (e) {}
        return 1; // Default 10 mins / 15 words
    }

    function getSavedThemeMode() {
        try {
            return localStorage.getItem('mindcard-theme-mode') || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function renderProfileWeeklyStreak() {
        const container = document.getElementById('profileWeeklyStreakRow');
        if (!container) return;

        const days = [
            { label: 'T2', done: true },
            { label: 'T3', done: true },
            { label: 'T4', done: true },
            { label: 'T5', done: true },
            { label: 'T6', done: true },
            { label: 'T7', done: true },
            { label: 'CN', done: true, isToday: true }
        ];

        const labelsHtml = days.map(d => {
            const labelStyle = d.isToday
                ? 'color: #FB923C; font-weight: 900;'
                : 'color: var(--pf-text-secondary); font-weight: 700;';
            return `<div class="text-center text-[11px] tracking-tight tabular-nums" style="${labelStyle}">${d.label}</div>`;
        }).join('');

        const nodesHtml = days.map(d => {
            if (d.isToday) {
                return `
                    <div class="flex items-center justify-center">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center relative"
                             style="background: #F97316; color: #FFFBEB; border: 2px solid #FDE047; box-shadow: 0 0 10px rgba(249, 115, 22, 0.55);">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M12.5 2C12.5 2 18.5 6.4 18.5 12.8C18.5 16.9 15.3 20.5 11.5 20.5C7.4 20.5 4.5 17.1 4.5 13C4.5 10.2 6.1 7.6 7.4 6.2C7.1 8.1 8.1 9.5 9.3 9.8C8.6 6.8 10.2 3.9 12.5 2Z"/>
                            </svg>
                        </div>
                    </div>
                `;
            }
            if (d.done) {
                return `
                    <div class="flex items-center justify-center">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center"
                             style="background: #FB923C; color: #1C1004; box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.35);">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3.1" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center"
                         style="background: var(--pf-pill-neutral-bg); border: 1px solid var(--pf-pill-neutral-border);">
                        <span class="w-1.5 h-1.5 rounded-full" style="background: var(--pf-text-muted);"></span>
                    </div>
                </div>
            `;
        }).join('');

        // Duolingo Connected Weekly Streak Capsule (7-column aligned day headers + continuous glowing amber capsule bar)
        container.innerHTML = `
            <div class="w-full">
                <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; margin-bottom: 6px; padding: 0 6px;">
                    ${labelsHtml}
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; align-items: center; padding: 5px 6px; border-radius: 999px; background: linear-gradient(90deg, rgba(249, 115, 22, 0.16) 0%, rgba(251, 146, 60, 0.30) 100%); border: 1.5px solid rgba(251, 146, 60, 0.52); box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.14);">
                    ${nodesHtml}
                </div>
            </div>
        `;
    }

    function renderAllBadgesList(filter = activeBadgeFilter) {
        activeBadgeFilter = filter;
        const listEl = document.getElementById('profileAllBadgesGrid');
        if (!listEl) return;

        const totalCount = ALL_BADGES_CATALOG.length;
        const ownedCount = ALL_BADGES_CATALOG.filter(b => b.unlocked).length;
        const lockedCount = totalCount - ownedCount;

        const tabConfigs = [
            { id: 'profileBadgeTab-all', key: 'all', text: `Tất cả (${totalCount})` },
            { id: 'profileBadgeTab-owned', key: 'owned', text: `Đã sở hữu (${ownedCount})` },
            { id: 'profileBadgeTab-locked', key: 'locked', text: `Chưa sở hữu (${lockedCount})` }
        ];

        tabConfigs.forEach(t => {
            const btn = document.getElementById(t.id);
            if (!btn) return;
            btn.textContent = t.text;
            const isActive = t.key === activeBadgeFilter;
            if (isActive) {
                btn.className = 'flex-1 py-1.5 px-2 text-[11.5px] cursor-pointer pf-seg-btn-active tabular-nums';
                btn.style.cssText = 'border-radius: 10px; transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);';
            } else {
                btn.className = 'flex-1 py-1.5 px-2 text-[11.5px] cursor-pointer pf-seg-btn-inactive tabular-nums';
                btn.style.cssText = 'border-radius: 10px; transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);';
            }
        });

        const filtered = ALL_BADGES_CATALOG.filter(b => {
            if (activeBadgeFilter === 'owned') return b.unlocked;
            if (activeBadgeFilter === 'locked') return !b.unlocked;
            return true;
        });

        const checkSvg = `<svg class="w-2.5 h-2.5 mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        const lockSvg = `<svg class="w-2.5 h-2.5 mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

        listEl.innerHTML = filtered.map(b => {
            const cardStyle = b.unlocked
                ? `border-radius: 18px; background: var(--pf-card-bg); border: 1px solid ${b.accentBorder}; box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.18); transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1);`
                : 'border-radius: 18px; background: var(--pf-card-locked-bg); border: 1px solid var(--pf-card-locked-border); transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1);';

            // Every badge (owned AND locked) gets its colored icon box so badges always look vibrant & collectible
            const iconBoxStyle = `width: 44px; height: 44px; border-radius: 11px; background: ${b.accentBg}; color: ${b.accentColor}; border: 1px solid ${b.accentBorder}; box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.08);`;

            const statusPill = b.unlocked
                ? `<span class="px-2 py-0.5 pf-pill-owned text-[10.5px] font-bold shrink-0 flex items-center" style="border-radius: 6px;">${checkSvg}Đã sở hữu</span>`
                : `<span class="px-2 py-0.5 pf-pill-neutral text-[10.5px] font-semibold shrink-0 flex items-center" style="border-radius: 6px;">${lockSvg}Chưa mở</span>`;

            const barFillStyle = `width: ${b.progressPct}%; background: ${b.accentColor};`;
            const svgIcon = BADGE_SVGS[b.svgKey] || BADGE_SVGS.award;

            return `
                <div onclick="inspectProfileBadge('${b.title}', '${b.unlocked ? 'Đã sở hữu' : 'Chưa sở hữu'} · ${b.desc}')"
                     class="p-3 flex items-center gap-3 active:scale-[0.98] cursor-pointer select-none"
                     style="${cardStyle}">
                    <div class="flex items-center justify-center shrink-0" style="${iconBoxStyle}">
                        ${svgIcon}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[13.5px] font-extrabold pf-text-primary tracking-tight truncate">${b.title}</span>
                            ${statusPill}
                        </div>
                        <p class="text-[11.5px] font-medium pf-text-secondary mt-0.5 leading-snug">${b.desc}</p>
                        <div class="mt-2 flex items-center gap-2.5">
                            <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: var(--pf-progress-track);">
                                <div class="h-full rounded-full" style="${barFillStyle}"></div>
                            </div>
                            <span class="text-[11px] font-bold tabular-nums shrink-0" style="color: ${b.accentColor};">${b.progressText}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderSettingsDropdownLists() {
        const checkIconSvg = `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        // 1. Onboarding-Exact Language List (Zero B2/N3 Level Codes)
        const langListEl = document.getElementById('pfSettingsLangList');
        const currentLangCode = getSavedTargetLangCode();
        if (langListEl) {
            langListEl.innerHTML = ONBOARDING_LANGUAGES.map(lang => {
                const isSelected = lang.code === currentLangCode;
                return `
                    <div onclick="selectProfileTargetLanguage('${lang.code}')"
                         data-lang-code="${lang.code}"
                         class="pf-duo-option-card ${isSelected ? 'is-selected' : ''}">
                        <span class="shrink-0 flex items-center justify-center" style="width: 36px;">${ONBOARDING_FLAGS[lang.code] || ONBOARDING_FLAGS.EN}</span>
                        <div class="flex-1 min-w-0">
                            <span class="text-[14px] font-extrabold pf-text-primary block leading-tight">${lang.name}</span>
                            <span class="text-[11px] font-medium pf-text-muted block mt-0.5 tabular-nums">${lang.learners}</span>
                        </div>
                        <span class="pf-check-ring">${checkIconSvg}</span>
                    </div>
                `;
            }).join('');
        }

        // 2. Onboarding-Exact 5-Bar Proficiency Level List (Zero A1/B1/B2/C1 Codes)
        const levelListEl = document.getElementById('pfSettingsLevelList');
        const currentLevelIdx = getSavedLevelIdx();
        if (levelListEl) {
            levelListEl.innerHTML = PROFICIENCY_LEVELS.map((lv, idx) => {
                const isSelected = idx === currentLevelIdx;
                return `
                    <div onclick="selectProfileProficiencyLevel(${idx})"
                         class="pf-duo-option-card ${isSelected ? 'is-selected' : ''}">
                        <span class="shrink-0 flex items-center justify-center" style="width: 34px;">${renderOnboardingSignalBars(lv.bars, 5)}</span>
                        <div class="flex-1 min-w-0">
                            <span class="text-[13.5px] font-extrabold pf-text-primary block leading-tight">${lv.shortTag}</span>
                            <span class="text-[11px] font-medium pf-text-secondary block mt-0.5 truncate">${lv.desc}</span>
                        </div>
                        <span class="pf-check-ring">${checkIconSvg}</span>
                    </div>
                `;
            }).join('');
        }

        // 3. Onboarding-Exact Progressive Clock Daily Goal List
        const goalListEl = document.getElementById('pfSettingsGoalList');
        const currentGoalIdx = getSavedDailyGoalIdx();
        if (goalListEl) {
            goalListEl.innerHTML = DAILY_GOALS.map((g, idx) => {
                const isSelected = idx === currentGoalIdx;
                return `
                    <div onclick="selectProfileDailyGoal(${idx})"
                         class="pf-duo-option-card ${isSelected ? 'is-selected' : ''}">
                        <span class="shrink-0 flex items-center justify-center" style="width: 34px;">${renderOnboardingClockIcon(g.minutes)}</span>
                        <div class="flex-1 min-w-0">
                            <span class="text-[13.5px] font-extrabold pf-text-primary block leading-tight tabular-nums">${g.label}</span>
                            <span class="text-[11px] font-medium pf-text-secondary block mt-0.5 truncate">${g.desc}</span>
                        </div>
                        <span class="px-2 py-0.5 pf-pill-neutral text-[10.5px] font-bold tabular-nums shrink-0" style="border-radius: 6px;">${g.wordsLabel}</span>
                        <span class="pf-check-ring">${checkIconSvg}</span>
                    </div>
                `;
            }).join('');
        }

        // 4. Theme Mode List
        const themeListEl = document.getElementById('pfSettingsThemeList');
        const currentTheme = getSavedThemeMode();
        if (themeListEl) {
            themeListEl.innerHTML = THEME_MODES.map(t => {
                const isSelected = t.mode === currentTheme;
                return `
                    <div onclick="selectProfileThemeMode('${t.mode}')"
                         class="pf-duo-option-card ${isSelected ? 'is-selected' : ''}">
                        <div class="w-9 h-9 flex items-center justify-center shrink-0" style="border-radius: 10px; background: ${t.accentBg}; color: ${t.accentColor}; border: 1px solid rgba(255,255,255,0.1);">
                            ${t.iconSvg}
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="text-[13.5px] font-extrabold pf-text-primary block leading-tight">${t.title}</span>
                            <span class="text-[11px] font-medium pf-text-secondary block mt-0.5 truncate">${t.desc}</span>
                        </div>
                        <span class="pf-check-ring">${checkIconSvg}</span>
                    </div>
                `;
            }).join('');
        }
    }

    function toggleProfileSettingDropdown(key) {
        const card = document.getElementById(`pfDropdownCard-${key}`);
        const body = document.getElementById(`pfDropdownBody-${key}`);
        if (!card || !body) return;

        const isOpen = !body.classList.contains('hidden');
        if (isOpen) {
            body.classList.add('hidden');
            card.classList.remove('is-open');
        } else {
            body.classList.remove('hidden');
            card.classList.add('is-open');
        }
    }

    function selectProfileTargetLanguage(langCode) {
        const langObj = ONBOARDING_LANGUAGES.find(l => l.code === langCode) || ONBOARDING_LANGUAGES[0];
        activeTargetLangCode = langObj.code;

        try {
            localStorage.setItem('mindcard-target-lang', langObj.code);
            localStorage.setItem('mindcard-target-flag', langObj.flagEmoji);
            if (window.AppStore && typeof window.AppStore.setState === 'function') {
                window.AppStore.setState('targetLang', langObj.code);
            }
        } catch (e) {}

        if (typeof window.selectTargetLanguage === 'function') {
            try { window.selectTargetLanguage(langObj.flagEmoji, langObj.code, langObj.name); } catch (e) {}
        }

        renderProfileScreen();
        if (typeof window.showDictToast === 'function') {
            window.showDictToast(`Đã chọn ngôn ngữ học: ${langObj.name}`);
        }
    }

    function selectProfileProficiencyLevel(idx) {
        if (idx < 0 || idx >= PROFICIENCY_LEVELS.length) return;
        try {
            localStorage.setItem('mindcard-proficiency-level-idx', String(idx));
        } catch (e) {}
        renderProfileScreen();
        const lv = PROFICIENCY_LEVELS[idx];
        if (typeof window.showDictToast === 'function') {
            window.showDictToast(`Đã cập nhật trình độ: ${lv.shortTag}`);
        }
    }

    function selectProfileDailyGoal(idx) {
        if (idx < 0 || idx >= DAILY_GOALS.length) return;
        try {
            localStorage.setItem('mindcard-daily-goal-idx', String(idx));
        } catch (e) {}
        renderProfileScreen();
        const g = DAILY_GOALS[idx];
        if (typeof window.showDictToast === 'function') {
            window.showDictToast(`Đã đặt mục tiêu: ${g.label} (${g.wordsLabel})`);
        }
    }

    function selectProfileThemeMode(mode) {
        try {
            localStorage.setItem('mindcard-theme-mode', mode);
        } catch (e) {}
        if (typeof window.applyThemeMode === 'function') {
            window.applyThemeMode(mode);
        }
        renderProfileScreen();
    }

    function switchProfileSubTab(tabKey, badgeFilter) {
        activeProfileSubTab = tabKey === 'badges' ? 'badges' : 'overview';
        const overviewView = document.getElementById('profileSubView-overview');
        const badgesView = document.getElementById('profileSubView-badges');
        const btnOverview = document.getElementById('profileMainSubTab-overview');
        const btnBadges = document.getElementById('profileMainSubTab-badges');

        if (overviewView && badgesView) {
            if (activeProfileSubTab === 'badges') {
                overviewView.classList.add('hidden');
                badgesView.classList.remove('hidden');
            } else {
                badgesView.classList.add('hidden');
                overviewView.classList.remove('hidden');
            }
        }

        if (btnOverview && btnBadges) {
            const activeClass = 'flex-1 py-2 px-3 text-[12px] cursor-pointer pf-seg-btn-active flex items-center justify-center gap-1.5 select-none';
            const activeStyle = 'border-radius: 11px; transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);';
            const inactiveClass = 'flex-1 py-2 px-3 text-[12px] cursor-pointer pf-seg-btn-inactive flex items-center justify-center gap-1.5 select-none';
            const inactiveStyle = 'border-radius: 11px; transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);';

            if (activeProfileSubTab === 'overview') {
                btnOverview.className = activeClass;
                btnOverview.style.cssText = activeStyle;
                btnBadges.className = inactiveClass;
                btnBadges.style.cssText = inactiveStyle;
            } else {
                btnBadges.className = activeClass;
                btnBadges.style.cssText = activeStyle;
                btnOverview.className = inactiveClass;
                btnOverview.style.cssText = inactiveStyle;
            }
        }

        if (badgeFilter) {
            renderAllBadgesList(badgeFilter);
        } else {
            renderAllBadgesList(activeBadgeFilter);
        }
    }

    function renderProfileScreen() {
        const langCode = getSavedTargetLangCode();
        const langMeta = ONBOARDING_LANGUAGES.find(l => l.code === langCode) || ONBOARDING_LANGUAGES[0];
        const lvMeta = PROFICIENCY_LEVELS[getSavedLevelIdx()] || PROFICIENCY_LEVELS[3];

        const courseTextEl = document.getElementById('profileCourseLevelText');
        if (courseTextEl) courseTextEl.textContent = `${langMeta.name} · ${lvMeta.shortTag}`;

        const settingLangEl = document.getElementById('profileTargetLangLabel');
        if (settingLangEl) settingLangEl.textContent = langMeta.name;

        const lvValEl = document.getElementById('profileLevelValue');
        const lvSubEl = document.getElementById('profileLevelSub');
        if (lvValEl) lvValEl.textContent = lvMeta.shortTag;
        if (lvSubEl) lvSubEl.textContent = lvMeta.desc;

        let masteredCount = 123;
        let reviewingCount = 42;
        let deckCount = 8;

        if (typeof getLibraryStats === 'function' && typeof libraryDecks !== 'undefined' && Array.isArray(libraryDecks)) {
            const stats = getLibraryStats();
            masteredCount = 110 + (stats.fluent || 0) + (stats.memory || 0);
            reviewingCount = 35 + (stats.intro || 0) + (stats.familiar || 0);
            deckCount = Math.max(libraryDecks.length, 8);
        }

        const xpCount = (window.AppStore && window.AppStore.getState('userXP')) ? (1100 + window.AppStore.getState('userXP')) : 1450;
        const streakDays = (window.AppStore && window.AppStore.getState('studyStreakDays')) || 7;

        const elMastered = document.getElementById('profileStatMastered');
        const elReviewing = document.getElementById('profileStatReviewing');
        const elXP = document.getElementById('profileStatXP');
        const elDecks = document.getElementById('profileStatDecks');
        const elStreakNum = document.getElementById('profileStreakNumberBig');
        const elStreakTitle = document.getElementById('profileStreakCountTitle');

        if (elMastered) elMastered.textContent = String(masteredCount);
        if (elReviewing) elReviewing.textContent = String(reviewingCount);
        if (elXP) elXP.textContent = xpCount.toLocaleString('en-US');
        if (elDecks) elDecks.textContent = `${deckCount} bộ`;
        if (elStreakNum) elStreakNum.textContent = String(streakDays);
        if (elStreakTitle) elStreakTitle.textContent = `ngày liên tiếp`;

        const goal = DAILY_GOALS[getSavedDailyGoalIdx()];
        const goalValEl = document.getElementById('profileDailyGoalValue');
        const goalSubEl = document.getElementById('profileDailyGoalSub');
        if (goalValEl) goalValEl.textContent = goal.wordsLabel;
        if (goalSubEl) goalSubEl.textContent = goal.desc;

        renderProfileWeeklyStreak();
        renderAllBadgesList(activeBadgeFilter);
        renderSettingsDropdownLists();
    }

    function openAllBadgesModal(initialFilter = 'all') {
        switchProfileSubTab('badges', initialFilter);
    }

    function filterProfileBadges(filterKey) {
        renderAllBadgesList(filterKey);
    }

    function openProfileSettingsModal() {
        const modal = document.getElementById('profileSettingsModal');
        const content = document.getElementById('profileSettingsContent');
        if (!modal || !content) return;
        renderProfileScreen();
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-x-4');
    }

    function closeProfileSettingsModal() {
        const modal = document.getElementById('profileSettingsModal');
        const content = document.getElementById('profileSettingsContent');
        if (!modal || !content) return;
        modal.classList.add('opacity-0');
        content.classList.add('translate-x-4');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 180);
    }

    function inspectProfileBadge(title, statusText) {
        if (typeof window.showDictToast === 'function') {
            window.showDictToast(`Huy hiệu "${title}": ${statusText}`);
        }
    }

    window.renderProfileScreen = renderProfileScreen;
    window.switchProfileSubTab = switchProfileSubTab;
    window.openAllBadgesModal = openAllBadgesModal;
    window.filterProfileBadges = filterProfileBadges;
    window.openProfileSettingsModal = openProfileSettingsModal;
    window.closeProfileSettingsModal = closeProfileSettingsModal;
    window.toggleProfileSettingDropdown = toggleProfileSettingDropdown;
    window.selectProfileTargetLanguage = selectProfileTargetLanguage;
    window.selectProfileProficiencyLevel = selectProfileProficiencyLevel;
    window.selectProfileDailyGoal = selectProfileDailyGoal;
    window.selectProfileThemeMode = selectProfileThemeMode;
    window.inspectProfileBadge = inspectProfileBadge;

    document.addEventListener('DOMContentLoaded', () => {
        renderProfileScreen();
    });
})(window);
