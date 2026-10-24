// ========================================================
// 🎨 CHAPTER-THEMED SVG HERO BANNERS & RICH WORLD MAPS
// Ceiling: < 350 lines | 10 Custom Biomes Matched to Title
// ========================================================

(function (window) {
    'use strict';

    const CHAPTER_BIOMES = [
        {
            id: 'forest', key: /rừng|ngụ ngôn|forest|fable/i, motif: 'pines',
            bg: '#A1D4D5', skyTop: '#87B8C2', skyMid: '#9BC7CE', hill1: '#609AA6', hill2: '#72ACB8',
            mid1: '#8BC3C9', mid2: '#9CD1D2', low1: '#ACE0DB', shore: '#BAE6DD',
            waterTop: '#76C2D4', waterBot: '#53A3BA', accent: '#3E7487', accentDark: '#2C5868',
            pillBg: 'rgba(232, 246, 245, 0.94)', pillText: '#234E52',
            islandTop: '#A3C7C9', islandCore: '#BCE0E1', islandSide: '#5E8B8F',
            sections: ['Bìa rừng đom đóm', 'Lối mòn cổ thụ']
        },
        {
            id: 'village', key: /làng|cổ tích|village|shop|mua sắm/i, motif: 'cottages',
            bg: '#E8D5B5', skyTop: '#E5C598', skyMid: '#F2DEC0', hill1: '#C49A68', hill2: '#D2AC7E',
            mid1: '#DFBF95', mid2: '#E8CCA6', low1: '#F0DAB8', shore: '#F6E5C8',
            waterTop: '#6CB4C4', waterBot: '#4A92A4', accent: '#C05638', accentDark: '#7C3A24',
            pillBg: 'rgba(253, 246, 235, 0.94)', pillText: '#6B3E23',
            islandTop: '#DFC49E', islandCore: '#F2E2C6', islandSide: '#9E7648',
            sections: ['Cổng làng cối xay gió', 'Phố cổ tích lên đèn']
        },
        {
            id: 'river', key: /sông|thử thách|river|di chuyển|cầu/i, motif: 'river',
            bg: '#7EC4DC', skyTop: '#5CA4C4', skyMid: '#78BBD6', hill1: '#4284A2', hill2: '#5296B4',
            mid1: '#6CB2CC', mid2: '#7EC0D8', low1: '#90CCE2', shore: '#A4D8EC',
            waterTop: '#2488D8', waterBot: '#155EA2', accent: '#1E6091', accentDark: '#154266',
            pillBg: 'rgba(228, 246, 255, 0.95)', pillText: '#154266',
            islandTop: '#82C3DC', islandCore: '#ADE0F4', islandSide: '#3E7C98',
            sections: ['Bến phà sương sớm', 'Nhịp cầu vượt thác']
        },
        {
            id: 'valley', key: /thung lũng|can đảm|valley|thời tiết/i, motif: 'balloons',
            bg: '#EBBFA8', skyTop: '#E8A588', skyMid: '#F4C2A8', hill1: '#BA6A4E', hill2: '#CC7E62',
            mid1: '#DC967C', mid2: '#E6AA92', low1: '#F0BEA8', shore: '#F6CFC0',
            waterTop: '#58A8BE', waterBot: '#3C889E', accent: '#B84A32', accentDark: '#822E1C',
            pillBg: 'rgba(254, 241, 234, 0.94)', pillText: '#73311E',
            islandTop: '#E2B098', islandCore: '#F5D2C0', islandSide: '#A6684E',
            sections: ['Hẻm núi khinh khí cầu', 'Cầu treo bình minh']
        },
        {
            id: 'bazaar', key: /chợ phiên|kỳ thú|bazaar|market|sức khỏe/i, motif: 'tents',
            bg: '#C8B2DC', skyTop: '#8C6EB0', skyMid: '#A88EC8', hill1: '#6E5092', hill2: '#8264A6',
            mid1: '#9C80BE', mid2: '#AE96CE', low1: '#C0ACDC', shore: '#D0C0E8',
            waterTop: '#5C7AC0', waterBot: '#3E5A9E', accent: '#E11D48', accentDark: '#5B2C7A',
            pillBg: 'rgba(246, 238, 253, 0.94)', pillText: '#4C286E',
            islandTop: '#C4ACE0', islandCore: '#DFD0F2', islandSide: '#7E5FA0',
            sections: ['Quảng trường đèn lồng', 'Phiên chợ đêm sao']
        },
        {
            id: 'starlight', key: /thư viện|ánh sao|star|library|lịch trình/i, motif: 'observatory',
            bg: '#9AB2DE', skyTop: '#526AA2', skyMid: '#6E88BE', hill1: '#3E5488', hill2: '#4E689C',
            mid1: '#6882B6', mid2: '#7C96C8', low1: '#92AAD8', shore: '#A8BEE6',
            waterTop: '#4868B0', waterBot: '#2E4A8E', accent: '#364E88', accentDark: '#223462',
            pillBg: 'rgba(235, 241, 254, 0.94)', pillText: '#223462',
            islandTop: '#9EB4E0', islandCore: '#C2D2F2', islandSide: '#5A70A2',
            sections: ['Sảnh thiên văn ngân hà', 'Tháp chuông tinh tú']
        },
        {
            id: 'portal', key: /cánh cổng|bí mật|portal|gate|lịch sự/i, motif: 'portals',
            bg: '#92D2C0', skyTop: '#66B2A0', skyMid: '#80C4B2', hill1: '#428A78', hill2: '#549E8C',
            mid1: '#6EB8A6', mid2: '#82C8B6', low1: '#98D6C6', shore: '#AEE4D6',
            waterTop: '#2CA89C', waterBot: '#1A8076', accent: '#247260', accentDark: '#164E40',
            pillBg: 'rgba(230, 249, 243, 0.94)', pillText: '#164E40',
            islandTop: '#94CEBE', islandCore: '#B8E8DA', islandSide: '#4E8A7A',
            sections: ['Bậc thang cổ ngữ', 'Cổng dịch chuyển pha lê']
        },
        {
            id: 'kingdom', key: /vương quốc|lời kể|kingdom|dịch vụ/i, motif: 'castles',
            bg: '#ACC0E4', skyTop: '#7892C4', skyMid: '#92AAD8', hill1: '#5670A4', hill2: '#6A84B8',
            mid1: '#849ECE', mid2: '#98B0DC', low1: '#ACC2E8', shore: '#C0D2F2',
            waterTop: '#5278BC', waterBot: '#385C9E', accent: '#465E94', accentDark: '#2E4270',
            pillBg: 'rgba(236, 242, 253, 0.94)', pillText: '#283A66',
            islandTop: '#A8BCE2', islandCore: '#C8D8F4', islandSide: '#6276A4',
            sections: ['Đại lộ cờ hoa hoàng gia', 'Tháp chuông lâu đài']
        },
        {
            id: 'mountain', key: /đỉnh núi|truyền thuyết|mountain|peak|giải trí/i, motif: 'pagodas',
            bg: '#9EC8C2', skyTop: '#70A4A0', skyMid: '#88B8B4', hill1: '#4A7E7A', hill2: '#5C928E',
            mid1: '#76ACAA', mid2: '#8ABDBC', low1: '#A0CECA', shore: '#B6DEDB',
            waterTop: '#489496', waterBot: '#2E7476', accent: '#346A66', accentDark: '#204845',
            pillBg: 'rgba(231, 246, 244, 0.94)', pillText: '#1F4B47',
            islandTop: '#96C4BE', islandCore: '#B8E0DA', islandSide: '#52827C',
            sections: ['Sườn đá tuyết phủ', 'Đỉnh vân quang cổ tự']
        },
        {
            id: 'treasure', key: /kho báu|hành trình|treasure|finale|kết nối/i, motif: 'treasure',
            bg: '#E8CE98', skyTop: '#E8C27A', skyMid: '#F2D498', hill1: '#BE9046', hill2: '#CEA258',
            mid1: '#DCB670', mid2: '#E6C686', low1: '#F0D49E', shore: '#F6E2B6',
            waterTop: '#28A8BC', waterBot: '#167E92', accent: '#B47222', accentDark: '#7E4E12',
            pillBg: 'rgba(254, 246, 228, 0.94)', pillText: '#664412',
            islandTop: '#E2C488', islandCore: '#F5E0B2', islandSide: '#A4803E',
            sections: ['Vịnh san hô hải đăng', 'Đảo kho báu hoàng kim']
        }
    ];

    function resolveRoadmapChapterBiome(chapter, fallbackIdx = 0) {
        if (!chapter) return CHAPTER_BIOMES[fallbackIdx % CHAPTER_BIOMES.length];
        const text = `${chapter.title || ''} ${chapter.chapterTag || ''} ${chapter.desc || ''}`;
        const matched = CHAPTER_BIOMES.find(b => b.key.test(text));
        if (matched) return matched;
        const idx = typeof chapter.id === 'number' ? chapter.id : fallbackIdx;
        return CHAPTER_BIOMES[Math.abs(idx) % CHAPTER_BIOMES.length];
    }

    // Định nghĩa Symbol SVG (<g id="lmA">, <g id="lmB">, <g id="propC">) riêng cho từng Chương
    function buildMotifDefsAndExtras(b) {
        const a = b.accent, d = b.accentDark;
        switch (b.motif) {
            case 'river':
                return {
                    defs: `<g id="lmA"><path d="M 0 -24 C -8 -8 -18 4 -22 12 L 22 12 C 18 4 8 -8 0 -24 Z" fill="${a}"/><path d="M 0 -12 C -10 2 -22 14 -26 24 L 26 24 C 22 14 10 2 0 -12 Z" fill="${d}"/><rect x="-3" y="24" width="6" height="10" fill="#4A3525"/></g>
                        <g id="lmB"><rect x="-24" y="0" width="48" height="10" rx="3" fill="#8C583A" stroke="#5C3822" stroke-width="1.5"/><rect x="-18" y="10" width="5" height="16" fill="#5C3822"/><rect x="13" y="10" width="5" height="16" fill="#5C3822"/><circle cx="16" cy="-6" r="4.5" fill="#FDE047"/></g>
                        <g id="propC"><rect x="-6" y="-14" width="2.5" height="18" fill="#2C7A7B"/><ellipse cx="-4.8" cy="-15" rx="3" ry="6" fill="#744210"/><rect x="3" y="-11" width="2.5" height="15" fill="#2C7A7B"/><ellipse cx="4.2" cy="-12" rx="2.8" ry="5" fill="#744210"/></g>`,
                    waterway: `<path d="M 195 0 C 145 140, 295 280, 205 430 C 115 580, 125 720, 225 870 C 325 1020, 295 1170, 195 1320 C 115 1440, 165 1510, 205 1560 L 295 1560 C 265 1500, 215 1430, 285 1320 C 375 1170, 405 1020, 305 870 C 205 720, 205 580, 285 430 C 365 280, 225 140, 265 0 Z" fill="url(#lake)" opacity="0.88"/>
                        <path d="M 228 35 C 185 150, 315 280, 240 430 M 168 620 C 175 730, 295 860, 335 1010 M 295 1160 C 265 1270, 185 1380, 235 1510" stroke="#E0F7FA" stroke-width="3.2" stroke-dasharray="16 12" fill="none" opacity="0.82"/>
                        <g><path d="M 145 415 Q 245 375 335 415" stroke="#7C3F1D" stroke-width="9" fill="none"/><path d="M 145 405 Q 245 365 335 405" stroke="#FDE68A" stroke-width="3" fill="none"/><path d="M 145 1015 Q 255 975 355 1015" stroke="#7C3F1D" stroke-width="9" fill="none"/><path d="M 145 1005 Q 255 965 355 1005" stroke="#FDE68A" stroke-width="3" fill="none"/></g>`
                };
            case 'cottages':
                return {
                    defs: `<g id="lmA"><polygon points="0,-24 -24,2 24,2" fill="${a}"/><rect x="-18" y="2" width="36" height="24" rx="2" fill="#FFF8EB" stroke="${d}" stroke-width="1.5"/><rect x="-6" y="8" width="12" height="11" rx="1.5" fill="#FBBF24"/></g>
                        <g id="lmB"><polygon points="0,-26 -14,22 14,22" fill="${d}"/><line x1="-22" y1="-22" x2="22" y2="12" stroke="#FFF" stroke-width="3.5"/><line x1="16" y1="-26" x2="-16" y2="18" stroke="#FFF" stroke-width="3.5"/><circle cx="0" cy="-4" r="4.5" fill="#FBBF24"/></g>
                        <g id="propC"><rect x="-14" y="-6" width="28" height="4" fill="#FFF8EB"/><rect x="-10" y="-11" width="4" height="14" fill="#D6B78C"/><rect x="6" y="-11" width="4" height="14" fill="#D6B78C"/></g>`,
                    waterway: ''
                };
            case 'balloons':
                return {
                    defs: `<g id="lmA"><circle cx="0" cy="-8" r="18" fill="${a}"/><path d="M -10 -8 Q 0 -28 10 -8" stroke="#FDE68A" stroke-width="2.5" fill="none"/><rect x="-6" y="13" width="12" height="8" rx="2" fill="${d}"/></g>
                        <g id="lmB"><polygon points="-28,24 0,-26 28,24" fill="${d}"/><polygon points="-12,-4 0,-26 12,-4" fill="#FDE68A" opacity="0.55"/></g>
                        <g id="propC"><ellipse cx="0" cy="0" rx="12" ry="6" fill="${d}"/><circle cx="4" cy="-3" r="3" fill="#FDE68A"/></g>`,
                    waterway: ''
                };
            case 'tents':
                return {
                    defs: `<g id="lmA"><polygon points="0,-24 -26,18 26,18" fill="${a}"/><polygon points="0,-24 -10,18 10,18" fill="#FEF08A" opacity="0.7"/><circle cx="0" cy="-27" r="4" fill="#FBBF24"/></g>
                        <g id="lmB"><polygon points="0,-22 -24,18 24,18" fill="${d}"/><polygon points="0,-22 -9,18 9,18" fill="#F472B6" opacity="0.65"/></g>
                        <g id="propC"><circle cx="0" cy="-8" r="7" fill="#F43F5E" stroke="#FDE047" stroke-width="1.5"/><line x1="0" y1="-1" x2="0" y2="5" stroke="#FDE047" stroke-width="2"/></g>`,
                    waterway: ''
                };
            case 'observatory':
                return {
                    defs: `<g id="lmA"><path d="M -22 4 A 22 22 0 0 1 22 4 Z" fill="${d}"/><rect x="-18" y="4" width="36" height="22" rx="2" fill="${a}"/><circle cx="0" cy="-6" r="4" fill="#FEF08A"/></g>
                        <g id="lmB"><polygon points="0,-26 -14,18 14,18" fill="${d}"/><circle cx="0" cy="-14" r="5" fill="#FEF08A"/></g>
                        <g id="propC"><circle cx="-8" cy="-6" r="2.5" fill="#FEF08A"/><circle cx="8" cy="-12" r="3" fill="#FEF08A"/><line x1="-8" y1="-6" x2="8" y2="-12" stroke="#FEF08A" stroke-width="1.2"/></g>`,
                    waterway: ''
                };
            case 'portals':
                return {
                    defs: `<g id="lmA"><path d="M -18 22 L -18 -14 A 18 18 0 0 1 18 -14 L 18 22 L 9 22 L 9 -12 A 9 9 0 0 0 -9 -12 L -9 22 Z" fill="${d}"/><ellipse cx="0" cy="4" rx="7" ry="13" fill="#6EE7B7"/></g>
                        <g id="lmB"><polygon points="0,-24 12,0 0,24 -12,0" fill="#34D399" stroke="${d}" stroke-width="2"/></g>
                        <g id="propC"><polygon points="0,-10 6,0 0,10 -6,0" fill="#A7F3D0"/></g>`,
                    waterway: ''
                };
            case 'castles':
                return {
                    defs: `<g id="lmA"><polygon points="0,-28 -18,0 18,0" fill="${d}"/><rect x="-14" y="0" width="28" height="32" fill="${a}"/><path d="M 0 -28 L 18 -21 L 0 -14 Z" fill="#EF4444"/></g>
                        <g id="lmB"><rect x="-16" y="-12" width="32" height="36" fill="${d}"/><rect x="-18" y="-18" width="8" height="8" fill="${a}"/><rect x="10" y="-18" width="8" height="8" fill="${a}"/><rect x="-5" y="4" width="10" height="18" rx="5" fill="#FDE68A"/></g>
                        <g id="propC"><polygon points="0,-12 8,0 0,12 -8,0" fill="#FBBF24"/></g>`,
                    waterway: ''
                };
            case 'pagodas':
                return {
                    defs: `<g id="lmA"><path d="M -26 0 Q 0 -16 26 0 L 18 6 L -18 6 Z" fill="${d}"/><path d="M -20 -14 Q 0 -28 20 -14 L 14 -8 L -14 -8 Z" fill="${d}"/><rect x="-12" y="6" width="24" height="18" fill="${a}"/></g>
                        <g id="lmB"><polygon points="-26,24 0,-26 26,24" fill="${d}"/><polygon points="-11,-4 0,-26 11,-4" fill="#FFFFFF"/></g>
                        <g id="propC"><rect x="-3" y="-12" width="6" height="16" fill="${d}"/><circle cx="0" cy="-8" r="2.5" fill="#FEF08A"/></g>`,
                    waterway: ''
                };
            case 'treasure':
                return {
                    defs: `<g id="lmA"><polygon points="-6,-24 6,-24 10,22 -10,22" fill="#DC2626"/><rect x="-8" y="-6" width="16" height="10" fill="#FFFFFF"/><circle cx="0" cy="-30" r="7" fill="#FEF08A"/></g>
                        <g id="lmB"><rect x="-16" y="-8" width="32" height="22" rx="4" fill="#B45309" stroke="#FBBF24" stroke-width="2"/><circle cx="0" cy="3" r="4" fill="#FEF08A"/></g>
                        <g id="propC"><polygon points="0,-10 8,0 0,10 -8,0" fill="#FDE047"/></g>`,
                    waterway: ''
                };
            default:
                return {
                    defs: `<g id="lmA"><rect x="-2.5" y="34" width="5" height="12" rx="1.5" fill="#3D5265"/><path d="M 0 -22 C -5 -8 -16 4 -20 10 L 20 10 C 16 4 5 -8 0 -22 Z M 0 -10 C -8 6 -19 20 -24 30 L 24 30 C 19 20 8 6 0 -10 Z M 0 4 C -10 18 -18 34 -22 42 L 22 42 C 18 34 10 18 0 4 Z" fill="${a}"/></g>
                        <g id="lmB"><rect x="-2.5" y="36" width="5" height="12" rx="1.5" fill="#495F72"/><path d="M 0 -26 C -6 -10 -18 3 -22 10 L 22 10 Z M 0 -12 C -10 6 -22 22 -27 32 L 27 32 Z M 0 2 C -12 20 -20 36 -25 44 L 25 44 Z" fill="${d}"/></g>
                        <g id="propC"><ellipse cx="0" cy="0" rx="11" ry="4" fill="#D5B895" stroke="#5A6D7C" stroke-width="1.2"/></g>`,
                    waterway: ''
                };
        }
    }

    function buildChapterHeroBannerSvgUri(chapter, fallbackIdx = 0) {
        const b = resolveRoadmapChapterBiome(chapter, fallbackIdx);
        const m = buildMotifDefsAndExtras(b);
        const riverBand = b.motif === 'river'
            ? `<path d="M 185 38 C 155 88, 255 128, 170 200 L 295 200 C 335 128, 225 88, 240 38 Z" fill="${b.waterTop}" opacity="0.9"/><path d="M 205 42 C 180 88, 265 128, 200 200" stroke="#E0F7FA" stroke-width="3" stroke-dasharray="10 8" fill="none"/>`
            : '';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 200" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${b.skyTop}"/><stop offset="55%" stop-color="${b.skyMid}"/><stop offset="100%" stop-color="${b.bg}"/>
                </linearGradient>
                <linearGradient id="lake" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${b.waterTop}"/><stop offset="100%" stop-color="${b.waterBot}"/></linearGradient>
                ${m.defs}
            </defs>
            <rect width="430" height="200" fill="url(#hSky)"/>
            <circle cx="76" cy="48" r="34" fill="#FFFFFF" opacity="0.32"/>
            <path d="M -20 108 C 95 68, 225 82, 345 114 L 450 112 L 450 200 L -20 200 Z" fill="${b.hill1}"/>
            <path d="M -20 136 C 110 114, 245 98, 365 128 L 450 138 L 450 200 L -20 200 Z" fill="${b.hill2}"/>
            ${riverBand}
            <use href="#lmA" x="58" y="108" transform="scale(1.1)"/><use href="#lmB" x="115" y="122"/>
            <use href="#lmA" x="368" y="106" transform="scale(1.1)"/><use href="#lmB" x="315" y="124"/>
            <path d="M -20 168 C 125 152, 285 156, 450 172 L 450 200 L -20 200 Z" fill="${b.mid1}"/>
        </svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
    }

    function buildBiomeSvgDataUri(biome) {
        const b = biome || CHAPTER_BIOMES[0];
        if (b.id === 'forest') {
            return `url("../assets/cards/calm_pine_lake_bg.svg?v=20261024_forest")`;
        }
        const m = buildMotifDefsAndExtras(b);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 1840" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${b.skyTop}"/><stop offset="45%" stop-color="${b.skyMid}"/><stop offset="100%" stop-color="${b.bg}"/>
                </linearGradient>
                <linearGradient id="lake" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${b.waterTop}"/><stop offset="100%" stop-color="${b.waterBot}"/>
                </linearGradient>
                ${m.defs}
            </defs>
            <rect width="430" height="1840" fill="url(#sky)"/>
            <circle cx="72" cy="88" r="64" fill="#FFFFFF" opacity="0.32"/>
            <path d="M -20 145 C 85 95, 215 110, 330 165 C 380 188, 415 195, 450 185 L 450 520 L -20 520 Z" fill="${b.hill1}"/>
            <path d="M -20 275 C 65 265, 165 225, 285 210 C 355 200, 410 215, 450 235 L 450 740 L -20 740 Z" fill="${b.hill2}"/>
            <path d="M -20 400 C 90 375, 215 415, 345 460 L 450 472 L 450 1020 L -20 1020 Z" fill="${b.mid1}"/>
            <path d="M -20 710 C 80 685, 195 645, 325 630 L 450 648 L 450 1280 L -20 1280 Z" fill="${b.mid2}"/>
            <path d="M -20 990 C 95 965, 225 1005, 350 1045 L 450 1055 L 450 1580 L -20 1580 Z" fill="${b.low1}"/>
            <path d="M -20 1310 C 105 1275, 245 1265, 370 1295 L 450 1322 L 450 1600 L -20 1600 Z" fill="${b.shore}"/>
            <path d="M 45 760 C 165 730, 275 710, 390 725 M 55 1140 C 165 1115, 280 1135, 380 1165" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.28"/>
            <path d="M 445 512 C 398 526, 368 546, 358 564 C 348 582, 388 598, 445 608 Z M -15 1102 C 32 1114, 64 1132, 72 1150 C 80 1168, 42 1186, -15 1198 Z" fill="url(#lake)" opacity="0.78"/>
            ${m.waterway}
            <use href="#lmA" x="34" y="195"/><use href="#lmB" x="68" y="235"/><use href="#lmA" x="388" y="205"/><use href="#lmB" x="352" y="255"/>
            <use href="#lmB" x="32" y="465"/><use href="#lmA" x="64" y="520"/><use href="#lmA" x="386" y="635"/><use href="#lmB" x="352" y="695"/>
            <use href="#lmA" x="30" y="820"/><use href="#lmB" x="64" y="885"/><use href="#lmB" x="388" y="965"/><use href="#lmA" x="355" y="1035"/>
            <use href="#lmA" x="32" y="1250"/><use href="#lmB" x="66" y="1315"/><use href="#lmA" x="388" y="1320"/><use href="#lmB" x="352" y="1385"/>
            <use href="#propC" x="98" y="340"/><use href="#propC" x="336" y="485"/><use href="#propC" x="88" y="745"/><use href="#propC" x="335" y="895"/><use href="#propC" x="92" y="1210"/><use href="#propC" x="332" y="1445"/>
            <path d="M -20 1522 C 65 1542, 165 1546, 265 1532 C 340 1522, 395 1529, 450 1540 L 450 1590 L -20 1590 Z" fill="${b.accentDark}" opacity="0.55"/>
            <path d="M -20 1542 C 65 1562, 165 1566, 265 1552 C 340 1542, 395 1549, 450 1560 L 450 1840 L -20 1840 Z" fill="url(#lake)"/>
            <path d="M -15 1545 C 65 1565, 165 1569, 265 1555 C 340 1545, 395 1552, 445 1563" fill="none" stroke="#E0F7FA" stroke-width="3.5" stroke-linecap="round" opacity="0.82"/>
            <g transform="translate(215, 1665) rotate(-5)">
                <ellipse cx="0" cy="8" rx="66" ry="17" fill="none" stroke="#BAE6FD" stroke-width="2" opacity="0.7"/>
                <path d="M -52 -4 C -34 -17, 34 -17, 54 -2 C 40 14, -34 14, -52 -4 Z" fill="${b.accent}" stroke="#FFFFFF" stroke-width="1.5"/>
                <polygon points="0,-42 0,-4 32,-12" fill="#FEF08A"/>
            </g>
        </svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`;
    }

    function renderThematicSceneryPropsHtml(loop, chapter) {
        const b = resolveRoadmapChapterBiome(chapter, 0);
        const isFirst = (loop % 2 === 0);
        const sideStyle = isFirst ? 'right: 12px; top: 82px;' : 'left: 12px; top: 96px;';
        const propLabel = `+5 ✦ ${b.sections[loop % 2] || b.id}`;
        const iconSvg = `<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="20" fill="#FFFFFF" opacity="0.55" class="sq-hotspot-pulse"/><polygon points="28,12 38,28 28,44 18,28" fill="${b.accent}"/><circle cx="28" cy="28" r="5" fill="#FDE047"/></svg>`;
        return `<div class="sq-thematic-prop sq-prop" style="position:absolute; ${sideStyle} width:44px; height:44px; z-index:4;" onclick="if(typeof triggerRoadmapPropEasterEgg==='function') triggerRoadmapPropEasterEgg(this, '${propLabel.replace(/'/g, "\\'")}', event)" title="Chạm khám phá bối cảnh chương">${iconSvg}</div>`;
    }

    window.CHAPTER_BIOMES = CHAPTER_BIOMES;
    window.resolveRoadmapChapterBiome = resolveRoadmapChapterBiome;
    window.buildChapterHeroBannerSvgUri = buildChapterHeroBannerSvgUri;
    window.buildBiomeSvgDataUri = buildBiomeSvgDataUri;
    window.renderRoadmapGameSceneryHtml = renderThematicSceneryPropsHtml;
})(window);
