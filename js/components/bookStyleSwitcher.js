// ========================================================
// 📚 10 LAYERED / STACKED BOOK DESIGNS (VARIATIONS OF STYLE 6)
// Ceiling: < 350 lines | Lets user preview & pick 1 of 10 stacks
// ========================================================

(function (window) {
    'use strict';

    const BOOK_STYLES_CATALOG = [
        { id: 1,  short: '6.1',  name: 'Fanned Art Deck',      desc: '2 lớp thẻ phía sau mang chính bức tranh của truyện xòe hình cánh quạt sang phải' },
        { id: 2,  short: '6.2',  name: 'Apple Top-Stack',      desc: '3 lớp thẻ tranh xếp nhô dần lên phía trên đỉnh chuẩn Album Stack iOS' },
        { id: 3,  short: '6.3',  name: 'Stepped Hardcover',    desc: 'Xếp bậc thang song song 3 tầng: Bìa trước + Xấp giấy kem + Bìa cứng Olive' },
        { id: 4,  short: '6.4',  name: 'Cross-Tilt Polaroid',  desc: '2 lớp đế nghiêng chéo đối xứng trái (-4.5°) và phải (+4.2°) nâng bìa chính' },
        { id: 5,  short: '6.5',  name: 'Slipcase Box Edition', desc: 'Sách bìa cứng đang rút hé ra khỏi hộp cứng (Slipcase) bọc vải bên trái' },
        { id: 6,  short: '6.6',  name: 'Glassmorphic Stack',   desc: 'Chồng thẻ kính mờ 3 tầng xếp lùi xuống dưới đáy' },
        { id: 7,  short: '6.7',  name: 'Twin Volume Stack',    desc: '2 quyển sách thật đặt chồng lệch góc (+5°) lộ cả gáy sách và mép giấy' },
        { id: 8,  short: '6.8',  name: 'Gold Tarot Deck',      desc: 'Bộ bài câu chuyện 3 lá viền nhũ vàng kim xòe nhẹ trên nền tối' },
        { id: 9,  short: '6.9',  name: 'Parchment Archive',    desc: 'Tệp bản thảo giấy kem cổ điển xếp lệch góc kẹp khung ảnh truyện' },
        { id: 10, short: '6.10', name: '3D Isometric Stack',   desc: 'Chồng sách 3 lớp kết hợp góc nghiêng không gian 3D (rotateY -16°)' }
    ];

    const BOOKS_DATA = [
        { idx: 0, vol: 'TẬP 01', title: 'Mưa Dưới Mái Hiên', img: 'assets/cards/lumi_rain_coffee_eaves.jpg' },
        { idx: 1, vol: 'TẬP 02', title: 'Nhầm Chuyến Xe',    img: 'assets/cards/lumi_train_station_night.jpg' },
        { idx: 2, vol: 'TẬP 03', title: 'Thử Thách Âm Điệu', img: 'assets/cards/lumi_melody_arena.jpg' },
        { idx: 3, vol: 'TẬP 04', title: 'Đêm Hội Đom Đóm',   img: 'assets/cards/pixar_night_farm_scenery.jpg' }
    ];

    let activeBookStyle = Number(localStorage.getItem('vibe_book_style_v6_id') || 1);

    function renderBookInnerHtml(b) {
        return `
            <div class="stack-layer-2" style="--book-bg: url('${b.img}');"></div>
            <div class="stack-layer-1" style="--book-bg: url('${b.img}');"></div>
            <div class="vibe-book-spine"></div>
            <img src="${b.img}" alt="${b.title}" class="w-full h-full object-cover relative z-10" loading="lazy">
        `;
    }

    function applyBookCoverStyle(styleId) {
        activeBookStyle = Number(styleId) || 1;
        try { localStorage.setItem('vibe_book_style_v6_id', String(activeBookStyle)); } catch (_) {}

        const found = BOOK_STYLES_CATALOG.find(s => s.id === activeBookStyle) || BOOK_STYLES_CATALOG[0];
        const labelEl = document.getElementById('currentBookStyleLabel');
        if (labelEl) {
            labelEl.textContent = `${found.short} — ${found.name}`;
        }

        const carousel = document.getElementById('storyCarouselContainer');
        if (carousel) {
            const wrapper = document.getElementById('storyCarouselStage') || carousel.parentElement;
            if (wrapper) wrapper.setAttribute('data-book-style', String(activeBookStyle));
            BOOKS_DATA.forEach(b => {
                const card = document.getElementById(`storyCard-${b.idx}`);
                if (!card) return;
                const cover = card.querySelector('.vibe-book-cover');
                if (cover) {
                    cover.style.setProperty('--book-bg', `url('${b.img}')`);
                    cover.innerHTML = renderBookInnerHtml(b);
                }
            });
        }

        document.querySelectorAll('.book-style-pill').forEach(btn => {
            const id = Number(btn.getAttribute('data-style-id'));
            btn.classList.toggle('is-active', id === activeBookStyle);
        });
    }

    function ensureSwitcherBar() {
        const carousel = document.getElementById('storyCarouselContainer');
        if (!carousel) return;

        let bar = document.getElementById('bookStyleSwitcherBar');
        if (!bar && carousel.parentElement) {
            bar = document.createElement('div');
            bar.id = 'bookStyleSwitcherBar';
            bar.className = 'book-style-switcher-bar';
            carousel.parentElement.insertBefore(bar, carousel);
        }
        if (bar) {
            bar.innerHTML = BOOK_STYLES_CATALOG.map(s => `
                <button type="button" class="book-style-pill ${s.id === activeBookStyle ? 'is-active' : ''}"
                        data-style-id="${s.id}" onclick="applyBookCoverStyle(${s.id})" title="${s.name} — ${s.desc}">
                    Kiểu ${s.short}: ${s.name}
                </button>
            `).join('');
        }
        applyBookCoverStyle(activeBookStyle);
    }

    function openAllBookStylesModal() {
        let modal = document.getElementById('allBookStylesComparisonModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'allBookStylesComparisonModal';
            modal.style.cssText = 'position:absolute;inset:0;z-index:99999;background:rgba(10,12,8,0.95);backdrop-filter:blur(16px);display:flex;flex-direction:column;padding:18px 14px;overflow-y:auto;border-radius:inherit;';
            document.body.appendChild(modal);
        }
        const sample = BOOKS_DATA[0];
        modal.innerHTML = `
            <div style="width:100%;margin:0 auto;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;position:sticky;top:0;z-index:50;background:rgba(10,12,8,0.92);padding:6px 2px 10px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <div>
                        <div style="font-size:10px;font-weight:800;letter-spacing:0.14em;color:#B8D166;text-transform:uppercase;">CHỒNG SÁCH XẾP LỚP (6.1 – 6.10)</div>
                        <h3 style="margin:2px 0 0;font-size:18px;font-weight:800;color:#F2F1EA;">Chạm vào 1 kiểu để áp dụng</h3>
                    </div>
                    <button type="button" onclick="document.getElementById('allBookStylesComparisonModal').remove()"
                            style="width:34px;height:34px;border-radius:999px;border:none;background:rgba(255,255,255,0.14);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">✕</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding-bottom:36px;">
                    ${BOOK_STYLES_CATALOG.map(s => `
                        <div data-book-style="${s.id}" onclick="applyBookCoverStyle(${s.id}); document.getElementById('allBookStylesComparisonModal').remove();"
                             style="background:#1B1E16;border:1.5px solid ${s.id === activeBookStyle ? '#B8D166' : 'rgba(255,255,255,0.09)'};border-radius:18px;padding:14px 11px 12px;cursor:pointer;display:flex;flex-direction:column;gap:12px;">
                            <div style="width:74%;margin:6px auto 2px;">
                                <div class="vibe-book-cover" style="--book-bg: url('${sample.img}');">
                                    ${renderBookInnerHtml(sample)}
                                </div>
                            </div>
                            <div>
                                <div style="display:flex;align-items:center;justify-content:space-between;">
                                    <span style="font-size:10.5px;font-weight:800;color:#B8D166;">KIỂU ${s.short}</span>
                                    ${s.id === activeBookStyle ? '<span style="font-size:9.5px;font-weight:800;background:#B8D166;color:#182000;padding:1px 6px;border-radius:99px;">Đang chọn</span>' : ''}
                                </div>
                                <div style="font-size:13px;font-weight:800;color:#fff;margin-top:2px;">${s.name}</div>
                                <div style="font-size:10.5px;color:rgba(242,241,234,0.65);line-height:1.35;margin-top:3px;">${s.desc}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.applyBookCoverStyle = applyBookCoverStyle;
    window.openAllBookStylesModal = openAllBookStylesModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureSwitcherBar);
    } else {
        ensureSwitcherBar();
    }
})(window);
